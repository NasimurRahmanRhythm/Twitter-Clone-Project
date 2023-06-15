import { getUserFeed } from "@/components/tweet/services/server/get-tweet.server";
import { handleRequest } from "@/participated/middlewares/request-handler";
import { getServerSession } from "next-auth";
import { createOptions } from "../auth/[...nextauth]";

export default handleRequest({
  GET: async (req, res) => {
    const { pageIndex, pageSize } = req.query;
    const session = await getServerSession(req, res, createOptions(req));
    const feed = await getUserFeed({
      pageSize,
      pageIndex,
      userId: session.user.id,
    });
    return res.json({ success: true, error: null, data: feed });
  },
});
