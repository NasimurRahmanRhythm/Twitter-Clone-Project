import connectToDB from "@/src/libs/mongooseDB";
import serverAuth from "@/src/libs/serverAuth";
import Post from "@/src/models/Post";

export default async function handler(req, res) {
  if (req.method !== "PATCH") {
    return res.status(405).end();
  }

  try {
    await connectToDB();

    // const { postId, body } = req.body;
    // const { currentUser } = await serverAuth(req, res);
    const {postId, body, image} = req.body;
    console.log("PostId in edit post is ", postId);

  const updatedPost = await Post.findByIdAndUpdate(
    postId,
    {
      body,
      image
    },
    { new: true}
  );


  return res.status(200).json(updatedPost.toObject());
  } catch (error) {
    console.error(error);
    return res.status(400).json({ error: "Failed to edit post" });
  }
}
