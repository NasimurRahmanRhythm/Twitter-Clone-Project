// pages/api/posts/[postId].jsx
import Post from "@/models/Post";
import User from "@/models/User";
import connectToDB from "@/libs/mongooseDB";
import serverAuth from "@/libs/serverAuth";

export default async function handler(req, res) {
  try {
    await connectToDB();
    if (req.method === "GET") {
      const { postId } = req.query;
      if (!postId || typeof postId !== "string") {
        throw new Error("Invalid ID");
      }

      const posts = await Post.findById(postId)
        .populate("userId")
        .populate({
          path: "comments",
          populate: {
            path: "userId",
          },
        })
        .populate({
          path: "comments",
          populate: {
            path: "comments",
            populate: {
              path: "userId",
            },
          },
        })
        .sort({ createdAt: "desc" });
      return res.status(200).json(posts);
    }

    if (req.method === "PUT") {
      const { postId, body, image } = req.body;
      console.log("PostId in edit post is ", postId);

      const updatedPost = await Post.findByIdAndUpdate(
        postId,
        {
          body,
          image,
        },
        { new: true }
      );

      return res.status(200).json(updatedPost.toObject());
    }

    if (req.method === "DELETE") {
      const { postId } = req.body;
      const { currentUser } = await serverAuth(req, res);

      if (!postId || typeof postId !== "string") {
        throw new Error("Invalid Id");
      }
      const post = await Post.findById(postId);
      if (!post) {
        throw new Error("Post not found");
      }

      if (post.type !== "post") {
        const mainPost = await Post.findById(post.parent);

        if (!mainPost) {
          throw new Error("Main post not found");
        }
        if (mainPost.parent) {
          const mainPostPost = await Post.findById(mainPost.parent);
          await mainPostPost.updateOne({ $pull: { replies: mainPost._id } });
          await mainPost.updateOne({ $pull: { comments: postId } });
        } else {
          for (const replyId of post.comments) {
            await mainPost.updateOne({ $pull: { replies: replyId } });
          }
          await mainPost.updateOne({ $pull: { comments: postId } });
        }
      }
      if (post.type !== "reply") {
        for (const commentId of post.comments) {
          const comment = await Post.findByIdAndDelete(commentId);
        }
        for (const replyId of post.replies) {
          const reply = await Post.findByIdAndDelete(replyId);
        }
      }
      const post2 = await Post.findByIdAndDelete(postId);
      if (!post2) {
        throw new Error("Post not found");
      }

      return res.status(200).json({ message: "Post deleted successfully" });
    }

    if (req.method === "PATCH") {
      const { postId } = req.body;
      const { currentUser } = await serverAuth(req, res);

      if (!postId || typeof postId !== "string") {
        throw new Error("Invalid ID");
      }

      const post = await Post.findById(postId).select("likedIds");

      if (!post) {
        throw new Error("Invalid ID");
      }
      const isLiked = post.likedIds.includes(currentUser._id);
      if (isLiked) {
        post.likedIds.pull(currentUser._id);
      } else {
        post.likedIds.push(currentUser._id);
      }

      const updatedPost = await Post.findByIdAndUpdate(
        postId,
        {
          likedIds: post.likedIds,
        },
        { new: true }
      );
      return res
        .status(200)
        .json({ isLiked, updatedPost: updatedPost.toObject() });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).end();
  }
}
