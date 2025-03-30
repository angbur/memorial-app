import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "10mb",
    },
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const client = await clientPromise;
    const db = client.db("memorial-app");
    const imagesCollection = db.collection("images");

    if (req.method === "POST") {
      const { candleId, images } = req.body;

      if (!candleId || !images || !Array.isArray(images)) {
        console.error("Invalid request: Missing candleId or images");
        return res.status(400).json({ error: "Invalid request. Candle ID and images are required." });
      }

      for (const image of images) {
        if (!image.startsWith("data:image/")) {
          console.error("Invalid image format detected");
          return res.status(400).json({ error: "Invalid image format" });
        }
        if (Buffer.byteLength(image.split(",")[1], "base64") > 8 * 1024 * 1024) { // 8MB limit
          console.error("Image size exceeds the limit of 8MB");
          return res.status(400).json({ error: "Image size exceeds the limit of 8MB" });
        }
      }

      try {
        const imageDocuments = images.map((image) => ({
          candleId: new ObjectId(candleId),
          image,
          createdAt: new Date(),
        }));

        const result = await imagesCollection.insertMany(imageDocuments);

        if (!result.acknowledged) {
          console.error("Failed to save images to the database");
          return res.status(500).json({ error: "Failed to save images" });
        }

        return res.status(200).json({ message: "Images uploaded successfully" });
      } catch (error) {
        console.error("Error saving images to the database:", error);
        return res.status(500).json({ error: "Failed to save images to the database" });
      }
    } else if (req.method === "GET") {
      try {
        const { page = 1, limit = 6 } = req.query;
        const pageNumber = parseInt(page as string, 10);
        const limitNumber = parseInt(limit as string, 10);

        if (isNaN(pageNumber) || isNaN(limitNumber) || pageNumber < 1 || limitNumber < 1) {
          return res.status(400).json({ error: "Invalid pagination parameters" });
        }

        const skip = (pageNumber - 1) * limitNumber;
        const images = await imagesCollection
          .find({})
          .skip(skip)
          .limit(limitNumber)
          .toArray();

        const totalImages = await imagesCollection.countDocuments();
        const totalPages = Math.ceil(totalImages / limitNumber);

        return res.status(200).json({
          images: images.map((img) => ({
            id: img._id.toString(),
            candleId: img.candleId.toString(),
            image: img.image,
            createdAt: img.createdAt,
          })),
          pagination: {
            totalImages,
            totalPages,
            currentPage: pageNumber,
          },
        });
      } catch (error) {
        console.error("Error fetching images from the database:", error);
        return res.status(500).json({ error: "Failed to fetch images" });
      }
    } else if (req.method === "DELETE") {
      if (process.env.NODE_ENV !== "development") {
        console.error("Attempt to delete images in non-development environment");
        return res.status(403).json({ error: "Deleting images is allowed only in local environments" });
      }

      const { id } = req.body;
      if (!id) {
        console.error("Missing image ID in delete request");
        return res.status(400).json({ error: "Image ID is required" });
      }

      try {
        const result = await imagesCollection.deleteOne({ _id: new ObjectId(id) });
        if (result.deletedCount === 0) {
          console.error("Image not found for deletion");
          return res.status(404).json({ error: "Image not found" });
        }

        return res.status(200).json({ message: "Image deleted successfully" });
      } catch (error) {
        console.error("Error deleting image from the database:", error);
        return res.status(500).json({ error: "Failed to delete image" });
      }
    } else {
      console.error(`Method ${req.method} not allowed`);
      res.setHeader("Allow", ["POST", "GET", "DELETE"]);
      return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    }
  } catch (error) {
    console.error("Unexpected API Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
