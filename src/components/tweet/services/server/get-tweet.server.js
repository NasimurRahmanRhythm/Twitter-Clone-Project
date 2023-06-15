import TweetModel from "@/main/models/tweet.schema";
import { addIsLiked } from "@/participated/libs/addIsLiked";
import { mapId } from "@/participated/libs/mapId";

export async function getAllTweets() {
  const tweets = await TweetModel.find({ type: "tweet" })
    .sort({ createdAt: -1 })
    .lean();
  return tweets.map((tweet) => mapId(tweet));
}

export async function getTweetById(id) {
  let tweet = await TweetModel.findById(id).populate("replies").lean();
  tweet.replies = tweet.replies.map((reply) => mapId(reply));
  return mapId(tweet);
}

export async function getFeed(user) {
  let tweets = await TweetModel.find({ type: { $in: ["tweet", "retweet"] } })
    .populate({
      path: "replies",
      options: { sort: { createdAt: -1 } },
      populate: { path: "replies" },
    })
    .populate({
      path: "parent",
      populate: { path: "replies", populate: "replies" },
    })
    .sort({ createdAt: -1 })
    .lean();
  tweets = tweets.map((tweet) => {
    if (tweet.parent && tweet.type === "retweet") {
      tweet.parent = addIsLiked(tweet.parent, user.id);
      return mapId(tweet);
    } else {
      tweet = addIsLiked(tweet, user.id);
      return tweet;
    }
  });
  return tweets;
}

export async function getUserFeed({ userId, pageIndex = 1, pageSize = 10 }) {
  try {
    let tweets = await TweetModel.find({ type: { $in: ["tweet", "retweet"] } })
      .select({ replies: 0 })
      .skip((pageIndex - 1) * pageSize)
      .limit(pageSize)
      .populate({ path: "parent", select: { replies: 0 } })
      .sort({ createdAt: -1 })
      .lean();
    tweets = tweets.map((tweet) => {
      if (tweet.parent) {
        tweet.parent = addIsLiked(tweet.parent, userId);
        tweet.parent.replies = [];
      }
      tweet = addIsLiked(tweet, userId);
      tweet.replies = [];
      return tweet;
    });
    return { pageIndex, pageSize, data: tweets };
  } catch (err) {
    return { status: 400, error: err._message };
  }
}

export async function getReplies({
  parentId,
  pageIndex = 1,
  pageSize = 10,
  userId,
}) {
  try {
    let tweet = await TweetModel.findById(parentId)
      .select("replies")
      .populate({
        path: "replies",
        select: { replies: 0, retweets: 0 },
        options: {
          skip: (pageIndex - 1) * pageSize,
          limit: pageSize,
          sort: { createdAt: -1 },
        },
      })
      .lean();
    const replies = tweet.replies.map((reply) => {
      if (reply.parent) {
        reply.parent = addIsLiked(reply.parent, userId);
        reply.parent.replies = [];
      }
      reply = addIsLiked(reply, userId);
      reply.replies = [];
      return reply;
    });
    return { pageIndex, pageSize, data: replies };
  } catch (err) {
    throw { status: 500, error: err._message };
  }
}
