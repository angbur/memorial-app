import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const client = await clientPromise;
    const db = client.db("memorial-app");
    const commentsCollection = db.collection("comments");

    if (req.method === "GET") {
      const comments = await commentsCollection
        .find({})
        .sort({ _id: -1 })
        .toArray();
      res.status(200).json({
        comments: comments.map((c) => ({
          id: c._id.toString(),
          text: c.text,
          images: c.images || [],
          candles: c.candles || [],
        })),
      });
    } else if (req.method === "POST") {
      const { text, images, commentId, name } = req.body;

      if (text) {
        await commentsCollection.insertOne({ text, images: images || [], candles: [] });
        const comments = await commentsCollection.find({}).toArray();
        res.status(201).json({
          comments: comments.map((c) => ({
            id: c._id.toString(),
            text: c.text,
            images: c.images || [],
            candles: c.candles || [],
          })),
        });
      } else if (commentId && name) {
        const date = new Date().toISOString();
        await commentsCollection.updateOne(
          { _id: new ObjectId(commentId) },
          { $push: { candles: { name, date } } }
        );
        const comments = await commentsCollection.find({}).toArray();
        res.status(201).json({
          comments: comments.map((c) => ({
            id: c._id.toString(),
            text: c.text,
            images: c.images || [],
            candles: c.candles || [],
          })),
        });
      } else {
        res.status(400).json({ error: "Invalid request" });
      }
    } else {
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    }
  } catch (error) {
    console.error("API Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
