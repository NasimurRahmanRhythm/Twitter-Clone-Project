import serverAuth from "@/src/libs/serverAuth";
import connectToDB from "@/src/libs/mongooseDB";
import Post from "@/src/models/Post";
import User from "@/src/models/User";
import Notification from "@/src/models/Notification";

export default async function handler(req, res) {
  if (req.method !== "PATCH") {
    return res.status(405).end();
  }

  try {
    await connectToDB();

    const { postId } = req.body;
    const { currentUser } = await serverAuth(req, res);

    if (!postId || typeof postId !== "string") {
      throw new Error("Invalid ID");
    }

    const post = await Post.findById(postId).select("likedIds");
    console.log('likes.js->',post.likedIds)

    if (!post) {
      throw new Error("Invalid ID");
    }

    console.log("Current User is " + currentUser._id);
    console.log(typeof(currentUser._id));
    const isLiked = post.likedIds.includes(currentUser._id);
    if (isLiked) {
      //like
      post.likedIds.pull(currentUser._id);
    }
else {
      //unlike
      //console.log("Delete krlam " + updatedLikedIds);
      //console.log("Delete holo " + likedId);
      post.likedIds.push(currentUser._id);
    }

    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      {
        likedIds: post.likedIds,
      },
      { new: true }
    );
    console.log(updatedPost);
    return res.status(200).json({ isLiked, updatedPost: updatedPost.toObject() });
  } catch (error) {
    console.log(error);
    return res.status(400).end();
  }
}

