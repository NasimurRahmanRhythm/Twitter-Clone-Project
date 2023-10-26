// pages/api/users/[userId].jsx
import User from "@/models/User";
import connectToDB from "@/libs/mongooseDB";
import serverAuth from "@/libs/serverAuth";

export default async function handler(req, res) {
  try {
    await connectToDB();
    if (req.method === "GET") {
      const { userId } = req.query;

      if (!userId || typeof userId !== "string") {
        throw new Error("Invalid ID");
      }

      const existingUser = await User.findById(userId);

      return res.status(200).json(existingUser);
    }

    if (req.method === "PUT") {
      const { currentUser } = await serverAuth(req, res);

      const { name, username, bio, profileImage, coverImage } = req.body;

      if (!name || !username) {
        throw new Error("Missing fields");
      }

      const updatedUser = await User.findByIdAndUpdate(
        currentUser._id,
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
    }

    if (req.method === "PATCH") {
      const { userId } = req.body;
      const { currentUser } = await serverAuth(req, res);
      console.log("follow userId is ", userId);
      if (!userId) {
        throw new Error("Invalid userID");
      }

      const user = await User.findById(userId).select("followerIds");
      const nowUser = await User.findById(currentUser._id).select(
        "followingIds"
      );

      if (!user) {
        throw new Error("Invalid ID");
      }
      if (!nowUser) {
        throw new Error("Invalid Follow ID");
      }

      const isFollowing = user.followerIds.includes(nowUser._id);

      if (!isFollowing) {
        user.followerIds.push(nowUser._id);
        nowUser.followingIds.push(user._id);
      } else {
        user.followerIds.pull(nowUser._id);
        nowUser.followingIds.pull(user._id);
      }

      const updatedNowUser = await User.findByIdAndUpdate(
        nowUser._id,
        {
          followingIds: nowUser.followingIds,
        },
        { new: true }
      );

      const updatedUser = await User.findByIdAndUpdate(
        user._id,
        {
          followerIds: user.followerIds,
        },
        { new: true }
      );

      return res
        .status(200)
        .json({
          isFollowing,
          updatedNowUser: updatedNowUser.toObject(),
          updatedUser: updatedUser.toObject(),
        });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).end();
  }
}
