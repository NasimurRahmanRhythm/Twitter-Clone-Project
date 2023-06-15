import { deleteTweet } from "@/components/tweet/services/server/delete-tweet.server";
import { updateTweet } from "@/components/tweet/services/server/update-tweet.server";
import { handleRequest } from "@/participated/middlewares/request-handler";
import { parseForm } from "@/participated/libs/parse-form";
import { getServerSession } from "next-auth";
import { createOptions } from "../auth/[...nextauth]";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default handleRequest({
  PATCH: async (req, res) => {
    const { tweetId } = req.query;
    const { fields, files } = await parseForm(req);
    const image = files.image
      ? "http://localhost:3000/uploads/" + files.image?.newFilename
      : fields.imageUrl;
    const text = fields.content;
    const { user } = await getServerSession(req, res, createOptions(req));
    const newTweet = await updateTweet({
      tweetId,
      text,
      image,
      userId: user.id,
    });
    return res.status(200).json({ success: true, error: null, data: newTweet });
  },

  DELETE: async (req, res) => {
    const { tweetId } = req.query;
    const { user } = await getServerSession(req, res, createOptions(req));
    await deleteTweet({ tweetId, userId: user.id });
    return res.json({ success: true, error: null, data: {} });
  },
});
