import { handleRequest } from "@/participated/middlewares/request-handler";
import { getServerSession } from "next-auth";
import { parseForm } from "@/participated/libs/parse-form";
import { createTweet } from "@/components/tweet/services/server/create-tweet.server";
import { createOptions } from "../auth/[...nextauth]";
export const config = {
  api: {
    bodyParser: false,
  },
};
export default handleRequest({
  POST: async (req, res) => {
    const { fields, files } = await parseForm(req);
    const image = files.image
      ? "http://localhost:3000/uploads/" + files.image?.newFilename
      : undefined;
    const text = fields.text;
    const { user } = await getServerSession(req, res, createOptions(req));
    const tweet = await createTweet({ text, image, user });
    return res.status(201).json({ success: true, data: tweet, error: null });
  },
});
