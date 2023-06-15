import { handleRequest } from "@/participated/middlewares/request-handler";
import TweetModel from "@/main/models/tweet.schema";
import { getServerSession } from "next-auth";
import { createOptions } from "../auth/[...nextauth]";
export default handleRequest({
  async POST(req, res) {
    const { tweetId } = req.body;
    const { user } = await getServerSession(req, res, createOptions(req));
    const tweet = await TweetModel.findById(tweetId).select("likes totalLikes");
    if (tweet.likes.includes(user.id)) {
      tweet.likes.pull(user.id);
      tweet.totalLikes--;
    } else {
      tweet.likes.push(user.id);
      tweet.totalLikes++;
    }
    await tweet.save();
    return res.json({
      success: true,
      error: null,
      data: { message: "liked successfully" },
    });
  },
});
