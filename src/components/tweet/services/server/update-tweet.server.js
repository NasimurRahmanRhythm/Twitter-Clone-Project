import TweetModel from "@/main/models/tweet.schema";
import { mapId } from "@/participated/libs/mapId";

export async function updateTweet({ tweetId, text, image, userId }) {
  try {
    const tweet = await TweetModel.findById(tweetId);
    if (tweet.user.id != userId) {
      throw { status: 400, error: "do not have access to modify" };
    }
    tweet.content = { text, image };
    tweet.save();
    return mapId(tweet._doc);
  } catch (err) {
    throw { status: 500, error: err.message };
  }
}
