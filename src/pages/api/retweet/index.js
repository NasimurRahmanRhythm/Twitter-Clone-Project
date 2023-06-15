import { createRetweet } from "@/components/tweet/services/server/create-tweet.server";
import { deleteRetweet } from "@/components/tweet/services/server/delete-tweet.server";
import { handleRequest } from "@/participated/middlewares/request-handler";
import { getServerSession } from "next-auth";
import { createOptions } from "../auth/[...nextauth]";

export default handleRequest({
  POST: async (req, res) => {
    const { tweetId } = req.body;
    const { user } = await getServerSession(req, res, createOptions(req));
    const retweet = await createRetweet({ user, tweetId });
    return res.status(201).json({ success: true, error: null, data: retweet });
  },

  DELETE: async (req, res) => {
    const { tweetId } = req.query;
    const { user } = await getServerSession(req, res, createOptions(req));
    await deleteRetweet({ tweetId, user });
    return res.json({ success: true, error: null, data: {} });
  },
});
