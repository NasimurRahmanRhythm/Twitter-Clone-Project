import serverAuth from "@/src/libs/serverAuth";
import connectToDB from "@/src/libs/mongooseDB";
import User from "@/src/models/User";

export default async function handler(req, res) {
  if (req.method !== "POST" && req.method !== "DELETE") {
    return res.status(405).end();
  }

  try {
    await connectToDB();

    const { userId } = req.body;
    const { currentUser } = await serverAuth(req, res);

    if (!userId || typeof userId !== "string") {
      throw new Error("Invalid ID");
    }

    const user = await User.findById(userId);

    if (!user) {
      throw new Error("Invalid ID");
    }

    let updatedFollowingIds = [...(user.followingIds || [])];

    if (req.method === "POST") {
      updatedFollowingIds.push(userId);

    }

    if (req.method === "DELETE") {
      updatedFollowingIds = updatedFollowingIds.filter(
        (followingId) => followingId !== userId
      );
    }

    const updatedUser = await User.findByIdAndUpdate(
      currentUser._id,
      {
        followingIds: updatedFollowingIds,
      },
      { new: true }
    );

    return res.status(200).json(updatedUser.toObject());
  } catch (error) {
    console.log(error);
    return res.status(400).end();
  }
}
