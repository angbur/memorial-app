import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "@/lib/mongodb";

export const config = {
  api: {
    bodyParser: true,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const client = await clientPromise;
    const db = client.db("memorial-app");
    const candlesCollection = db.collection("candles");

    if (req.method === "GET") {
      const candles = await candlesCollection.find({}).sort({ date: -1 }).toArray();
      res.status(200).json({
        candles: candles.map((c) => ({
          id: c._id.toString(),
          name: c.name,
          comment: c.comment || null,
          images: c.images || [],
          date: c.date,
        })),
      });
    } else if (req.method === "POST") {
      const { name, comment } = req.body;

      if (!name) {
        return res.status(400).json({ error: "Name is required" });
      }

      const date = new Date().toISOString();

      const result = await candlesCollection.insertOne({
        name,
        comment: comment || null,
        images: [],
        date,
      });

      if (!result.acknowledged) {
        throw new Error("Failed to insert candle into the database");
      }

      res.status(201).json({ id: result.insertedId.toString() });
    } else {
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    }
  } catch (error) {
    console.error("API Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
