import UserModel from "@/main/models/user.schema";
import { addIsLiked } from "@/participated/libs/addIsLiked";
import { mapId } from "@/participated/libs/mapId";

export async function getProfileWithTweets(id, user) {
  let profile = await UserModel.findById(id)
    .select({ passwordHash: 0, followers: 0, followings: 0 })
    .populate({ path: "tweets", options: { sort: { createdBy: -1 } } })
    .lean();
  profile = mapId(profile);
  profile.tweets = profile.tweets.map((tweet) => mapId(tweet));
  return profile;
}

export async function getProfileWithFollowers(id, user) {
  let profile = await UserModel.findById(id)
    .select({ passwordHash: 0, followings: 0, tweets: 0 })
    .populate({
      path: "followers",
      select: "_id name username image",
      options: { sort: { createdBy: -1 } },
    })
    .lean();
  profile = mapId(profile);
  profile.followers = profile.followers.map((follower) => mapId(follower));
  return profile;
}

export async function getProfileWithFollowings(id, user) {
  let profile = await UserModel.findById(id)
    .select({ passwordHash: 0, tweets: 0, followers: 0 })
    .populate({
      path: "followings",
      select: "_id name username image",
      options: { sort: { createdBy: -1 } },
    })
    .lean();
  profile = mapId(profile);
  profile.followings = profile.followings.map((following) => mapId(following));
  profile.totalTweets = profile.tweets.length;
  profile.totalFollowers = profile.followers.length;
  profile.totalFollowings = profile.followings.length;
  return profile;
}

export async function getProfile(id, user) {
  let profile = await UserModel.findById(id)
    .select({ passwordHash: 0 })
    .populate({
      path: "followings",
      select: "_id name username image",
      options: { sort: { createdAt: -1 } },
    })
    .populate({
      path: "followers",
      select: "_id name username image",
      options: { sort: { createdAt: -1 } },
    })
    .populate({
      path: "tweets",
      options: { sort: { createdAt: -1 } },
      select: { replies: 0 },
      populate: [{ path: "parent", select: { replies: 0 } }],
    })
    .lean();
  profile = mapId(profile);
  profile.followings = profile.followings.map((following) => mapId(following));
  profile.followers = profile.followers.map((follower) => mapId(follower));
  profile.tweets = profile.tweets.map((tweet) => {
    if (tweet.parent && tweet.type === "retweet") {
      tweet.parent = addIsLiked(tweet.parent, user.id);
      return mapId(tweet);
    } else {
      tweet = addIsLiked(tweet, user.id);
      return tweet;
    }
  });
  profile.isFollowing = profile.followers.reduce(
    (acc, cur) => acc || cur.id.toString() === user.id.toString(),
    false
  );
  return profile;
}
