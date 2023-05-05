import serverAuth from "@/src/libs/serverAuth";
import connectToDB from "@/src/libs/mongooseDB";
import User from "@/src/models/User";

export default async function handler(req, res) {
  if (req.method !== "PATCH") {
    return res.status(405).end();
  }

  try {
    await connectToDB();

    const { currentUser } = await serverAuth(req);

    const { name, username, bio, profileImage, coverImage } = req.body;

    if (!name || !username) {
      throw new Error("Missing fields");
    }

    const updatedUser = await User.findByIdAndUpdate(
      currentUser.id,
      {
        name,
        username,
        bio,
        profileImage,
        coverImage,
      },
      { new: true }
    );

    return res.status(200).json(updatedUser.toObject());
  } catch (error) {
    console.log(error);
    return res.status(400).end();
  }
}
