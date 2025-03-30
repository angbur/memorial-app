/* eslint-disable */
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
    const candlesCollection = db.collection("candles");

    if (req.method === "POST") {
      const { candleId, images } = req.body;

      if (!candleId || !images || !Array.isArray(images)) {
        return res.status(400).json({ error: "Invalid request. Candle ID and images are required." });
      }

      for (const image of images) {
        if (!image.startsWith("data:image/")) {
          return res.status(400).json({ error: "Invalid image format" });
        }
        if (Buffer.byteLength(image.split(",")[1], "base64") > 8 * 1024 * 1024) { // 8MB limit
          return res.status(400).json({ error: "Image size exceeds the limit of 8MB" });
        }
      }

      const result = await candlesCollection.updateOne(
        { _id: new ObjectId(candleId) },
        { $push: { images: { $each: images } } }
      );

      if (result.modifiedCount === 0) {
        return res.status(404).json({ error: "Candle not found or no changes made" });
      }

      res.status(200).json({ message: "Images uploaded successfully" });
    } else {
      res.setHeader("Allow", ["POST"]);
      res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    }
  } catch (error) {
    console.error("API Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
