import serverAuth from "@/libs/serverAuth";
import connectToDB from "@/libs/mongooseDB";
import Comment from "@/models/Comment";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  try {
    await connectToDB();

    const { currentUser } = await serverAuth(req);
    const { body } = req.body;
    const { postId } = req.query;

    if (!postId || typeof postId !== "string") {
      throw new Error("Invalid Id");
    }

    const comment = new Comment({
      body,
      userId: currentUser.id,
      postId,
    });

    await comment.save();

    return res.status(200).json(comment.toObject());
  } catch (error) {
    console.log(error);
    return res.status(400).end();
  }
}
