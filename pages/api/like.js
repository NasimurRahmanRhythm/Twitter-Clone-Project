import serverAuth from "@/libs/serverAuth";
import connectToDB from "@/libs/mongooseDB";
import Post from "@/models/Post";
import User from "@/models/User";
import Notification from "@/models/Notification";

export default async function handler(req, res) {
  if (req.method !== "POST" && req.method !== "DELETE") {
    return res.status(405).end();
  }

  try {
    await connectToDB();

    const { postId } = req.body;
    const { currentUser } = await serverAuth(req, res);

    if (!postId || typeof postId !== "string") {
      throw new Error("Invalid ID");
    }

    const post = await Post.findById(postId);

    if (!post) {
      throw new Error("Invalid ID");
    }

    let updatedLikedIds = [...(post.likedIds || [])];

    if (req.method === "POST") {
      updatedLikedIds.push(currentUser.id);

      // NOTIFICATION PART START
      try {
        const post = await Post.findById(postId);

        if (post?.userId) {
          await Notification.create({
            body: "Someone has liked your tweet!",
            userId: post.userId,
          });

          await User.findByIdAndUpdate(post.userId, {
            hasNotification: true,
          });
        }
      } catch (error) {
        console.log(error);
      }
      // NOTIFICATION PART END
    }

    if (req.method === "DELETE") {
      updatedLikedIds = updatedLikedIds.filter(
        (likedId) => likedId !== currentUser?.id
      );
    }

    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      {
        likedIds: updatedLikedIds,
      },
      { new: true }
    );

    return res.status(200).json(updatedPost.toObject());
  } catch (error) {
    console.log(error);
    return res.status(400).end();
  }
}
