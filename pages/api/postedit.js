import connectToDB from "@/src/libs/mongooseDB";
import serverAuth from "@/src/libs/serverAuth";
import Post from "@/src/models/Post";

export default async function handler(req, res) {
  if (req.method !== "PATCH") {
    return res.status(405).end();
  }

  try {
    await connectToDB();

    const { postId, body } = req.body;
    const { currentUser } = await serverAuth(req, res);

    if (!postId || typeof postId !== "string") {
      throw new Error("Invalid Post ID");
    }

    const filter = { _id: postId };
    const update = { body }; 
    const options = { new: true }; 

    const updatedPost = await Post.findByIdAndUpdate(filter, update, options);

    if (!updatedPost) {
      throw new Error("Post not found");
    }

    if (updatedPost.userId.toString() !== currentUser.id) {
      return res.status(403).json({ error: "You do not have permission to edit this post" });
    }

    return res.status(200).json({ message: "Post edited successfully", updatedPost });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ error: "Failed to edit post" });
  }
}
