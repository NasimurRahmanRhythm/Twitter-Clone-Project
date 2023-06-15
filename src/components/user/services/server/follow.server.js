import UserModel from "@/main/models/user.schema";

export async function follow({ followerId, followingId }) {
  try {
    const followingUser = await UserModel.findById(followingId).select(
      "followers"
    );
    const followerUser = await UserModel.findById(followerId).select(
      "followings"
    );
    if (
      followingUser.followers.includes(followerId) &&
      followerUser.followings.includes(followingId)
    ) {
      followingUser.followers.pull(followerId);
      followerUser.followings.pull(followingId);
    } else {
      followingUser.followers.push(followerId);
      followerUser.followings.push(followingId);
    }
    const promise1 = followerUser.save();
    const promise2 = followingUser.save();
    await Promise.all([promise1, promise2]);
    return true;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export async function unfollow({ followerId, followingId }) {
  try {
    const promise1 = UserModel.updateOne(
      { _id: followerId },
      { $pull: { followings: followingId }, $inc: { totalFollowings: -1 } }
    );
    const promise2 = UserModel.updateOne(
      { _id: followingId },
      { $pull: { followers: followerId }, $inc: { totalFollowers: -1 } }
    );
    await Promise.all([promise1, promise2]);
    return true;
  } catch (err) {
    console.log(err);
    throw err;
  }
}
