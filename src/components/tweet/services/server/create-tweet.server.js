import TweetModel from "@/main/models/tweet.schema";
import UserModel from "@/main/models/user.schema";
import { mapId } from "@/participated/libs/mapId";

export async function createTweet({ text, image, user }) {
  try {
    const tweet = await TweetModel.create({
      content: { text, image },
      user,
      type: "tweet",
    });
    await UserModel.updateOne(
      { _id: user.id },
      { $push: { tweets: tweet._id }, $inc: { totalTweets: 1 } }
    );
    return mapId(tweet._doc);
  } catch (err) {
    console.log("error in create tweet method", err);
    throw { status: 500, error: err._message };
  }
}

export async function createReply({ text, image, user, parent }) {
  try {
    const reply = await TweetModel.create({
      content: { text, image },
      user,
      parent,
      type: "reply",
    });
    await TweetModel.updateOne(
      { _id: parent },
      { $push: { replies: reply._id }, $inc: { totalReplies: 1 } }
    );
    return mapId(reply._doc);
  } catch (err) {
    console.log(err);
    throw { status: 400, error: err._message };
  }
}

export async function createRetweet({ user, tweetId }) {
  try {
    let retweet = await TweetModel.create({
      type: "retweet",
      user,
      parent: tweetId,
    });
    console.log("create retweet", user);
    retweet = mapId(retweet._doc);
    await TweetModel.updateOne(
      { _id: tweetId },
      { $inc: { totalRetweets: 1 }, $push: { retweets: retweet.id } }
    );
    await UserModel.updateOne(
      { _id: user.id },
      { $push: { tweets: retweet.id } }
    );
    return retweet;
  } catch (err) {
    console.log("error in createTweet", err);
    throw { status: 500, error: err._message };
  }
}
