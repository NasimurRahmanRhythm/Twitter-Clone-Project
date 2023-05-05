// pages/api/users/[userId].jsx
import User from "@/src/models/User";
import connectToDB from "@/src/libs/mongooseDB";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).end();
  }

  try {
    await connectToDB();

    const { userId } = req.query;

    if (!userId || typeof userId !== "string") {
      throw new Error("Invalid ID");
    }

    const existingUser = await User.findById(userId);

    const followersCount = await User.countDocuments({
      followingIds: userId,
    });

    return res.status(200).json({ ...existingUser.toObject(), followersCount });
  } catch (error) {
    console.log(error);
    return res.status(400).end();
  }
}
