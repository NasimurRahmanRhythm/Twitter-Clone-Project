import { handleRequest } from "@/participated/middlewares/request-handler";
import { getServerSession } from "next-auth";
import {
  follow,
  unfollow,
} from "@/components/user/services/server/follow.server";
import { createOptions } from "../auth/[...nextauth]";

export default handleRequest({
  POST: async (req, res) => {
    const { user: follower } = await getServerSession(
      req,
      res,
      createOptions(req)
    );
    const { id: followingId } = req.query;
    await follow({ followerId: follower.id, followingId: followingId });
    return res.json({ success: true, error: null, data: {} });
  },
});
