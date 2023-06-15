import TweetModel from "@/main/models/tweet.schema";
import UserModel from "@/main/models/user.schema";
import { mapId } from "@/participated/libs/mapId";

export async function deleteTweet({ tweetId, userId }) {
  try {
    const tweet = await TweetModel.findById(tweetId);
    if (tweet.user.id != userId) {
      throw { status: 400, error: "do not have access to delete" };
    }

    await TweetModel.deleteOne({ _id: tweetId });
    const promise1 =
      tweet.parent && tweet.type === "reply"
        ? TweetModel.updateOne(
            { _id: tweet.parent },
            { $pull: { replies: tweetId }, $inc: { totalReplies: -1 } }
          )
        : UserModel.updateOne(
            { _id: tweet.user.id },
            { $pull: { tweets: tweet._id }, $inc: { totalTweets: -1 } }
          );
    const promise2 = TweetModel.deleteMany({ _id: { $in: tweet.replies } });
    await Promise.all([promise1, promise2]);
    return mapId(tweet._doc);
  } catch (err) {
    console.log("error in deleteTweet", err);
    throw { status: 500, error: err.message };
  }
}

export async function deleteRetweet({ tweetId, user }) {
  try {
    const retweet = await TweetModel.findById(tweetId).lean();
    console.log(retweet);
    if (retweet.user.id != user.id) {
      throw { status: 400, error: "do not have access to delete" };
    }
    const promise3 = TweetModel.updateOne(
      { _id: retweet.parent },
      { $inc: { totalRetweets: -1 }, $pull: { retweets: retweet._id } }
    );
    const promise1 = TweetModel.deleteOne({ _id: tweetId });
    const promise2 = UserModel.updateOne(
      { _id: retweet.user.id },
      { $pull: { tweets: retweet._id } }
    );
    await Promise.all([promise1, promise2, promise3]);
    return retweet;
  } catch (err) {
    console.log(err);
    throw { status: 500, error: "internal error" };
  }
}
