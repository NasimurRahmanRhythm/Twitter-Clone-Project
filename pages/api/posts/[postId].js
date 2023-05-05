// pages/api/posts/[postId].jsx
import Post from "@/src/models/Post";
import User from "@/src/models/User";
import connectToDB from "@/src/libs/mongooseDB";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).end();
  }

  try {
    await connectToDB();

    const { postId } = req.query;
    if (!postId || typeof postId !== "string") {
      throw new Error("Invalid ID");
    }

    const post = await Post.findById(postId)
      .populate({
        path: "user",
        model: User,
      })
      .populate({
        path: "comments.user",
        model: User,
      })
      .sort({ "comments.createdAt": "desc" });

    return res.status(200).json(post);
  } catch (error) {
    console.log(error);
    return res.status(400).end();
  }
}
