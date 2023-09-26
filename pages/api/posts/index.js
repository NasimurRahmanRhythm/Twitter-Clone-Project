// pages/api/posts/index.jsx
import serverAuth from "@/src/libs/serverAuth";
import Post from "@/src/models/Post";
import User from "@/src/models/User";
import connectToDB from "@/src/libs/mongooseDB";

export default async function handler(req, res) {
  if (req.method !== "POST" && req.method !== "GET") {
    return res.status(405).end();
  }

  try {
    await connectToDB();

    if (req.method === "POST") {
      const { currentUser } = await serverAuth(req,res);
      const { body } = req.body;

      const post = new Post({
        body,
        userId: currentUser._id,
      });

      await post.save();

      return res.status(200).json(post);
    }

    if (req.method === "GET") {
      const { userId } = req.query;
      let posts;

      if (userId && typeof userId === "string") {
        posts = await Post.find({ userId })
          .populate("userId")
          .populate("comments.userId")
          .sort({ createdAt: "desc" });
      } else {
        posts = await Post.find({})
          .populate("userId")
          .populate("comments.userId")
          .sort({ createdAt: "desc" });
      }

      return res.status(200).json(posts);
    }
  } catch (error) {
    console.log(error);
    return res.status(400).end();
  }
}
