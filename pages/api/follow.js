import serverAuth from "@/libs/serverAuth";
import connectToDB from "@/libs/mongooseDB";
import User from "@/models/User";
import Notification from "@/models/Notification";

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

      // NOTIFICATION PART START
      try {
        await Notification.create({
          body: "Someone followed you!",
          userId,
        });

        await User.findByIdAndUpdate(userId, {
          hasNotification: true,
        });
      } catch (error) {
        console.log(error);
      }
      // NOTIFICATION PART END
    }

    if (req.method === "DELETE") {
      updatedFollowingIds = updatedFollowingIds.filter(
        (followingId) => followingId !== userId
      );
    }

    const updatedUser = await User.findByIdAndUpdate(
      currentUser.id,
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
