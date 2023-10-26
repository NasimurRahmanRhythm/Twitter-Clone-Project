// pages/api/posts/index.jsx
import serverAuth from "@/libs/serverAuth";
import Post from "@/models/Post";
import User from "@/models/User";
import connectToDB from "@/libs/mongooseDB";

export default async function handler(req, res) {
  if (req.method !== "POST" && req.method !== "GET") {
    return res.status(405).end();
  }

  try {
    await connectToDB();

    if (req.method === "POST") {
      const { currentUser } = await serverAuth(req, res);
      const { body, image, type, postId } = req.body;
      if (!body) {
        throw new Error("Missing Body");
      }

      if (type === "comment" && postId) {
        const parentPost = await Post.findById(postId);

        if (!parentPost) {
          throw new Error("Parent Post not found");
        }

        if (parentPost.type === "comment") {
          const mainPost = await Post.findById(parentPost.parent);
          if (!mainPost) {
            throw new Error("Parent Parent post not found");
          }

          const reply = new Post({
            body,
            image,
            type: "reply",
            userId: currentUser._id,
            parent: parentPost._id,
          });

          await reply.save();
          parentPost.comments.push(reply._id);
          await parentPost.save();
          mainPost.replies.push(reply._id);
          await mainPost.save();

          return res.status(200).json(reply);
        } else {
          const comment = new Post({
            body,
            image,
            type,
            userId: currentUser._id,
            parent: postId,
          });

          await comment.save();

          parentPost.comments.push(comment._id);
          await parentPost.save();

          return res.status(200).json(comment);
        }
      } else {
        const post = new Post({
          body,
          image,
          type,
          userId: currentUser._id,
        });

        await post.save();

        return res.status(200).json(post);
      }
    }
    if (req.method === "GET") {
      const { userId } = req.query;
      let posts;

      if (userId && typeof userId === "string") {
        posts = await Post.find({ userId })
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
      } else {
        posts = await Post.find({})
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
      }

      return res.status(200).json(posts);
    }
  } catch (error) {
    console.log(error);
    return res.status(400).end();
  }
}
