import Conversations from "@/models/Conversations";
import connectMongo from "@/libs/db";
import { POST } from "@/libs/reqMethods";

const createConversation = async (req, res) => {
  try {
    const { senderID, receiverID } = req.body;
    const members = [senderID, receiverID];
    const messages = [];

    const conversation = await Conversations.create({
      members,
      messages,
    });

    res.status(201).json({
      success: true,
      conversation,
    });
  } catch (error) {}
};

const getAllConversationsForUser = async (req, res) => {
  try {
    const { userID, receiverID } = req.body;
    const conversations = await Conversations.find({
      members: { $all: [userID, receiverID] },
    })
      .populate({
        path: "members",
        select: {
          name: 1,
          username: 1,
          email: 1,
          profilePicture: 1,
        },
      })
      .populate({
        path: "messages.sender",
        select: {
          name: 1,
          username: 1,
          email: 1,
          profilePicture: 1,
        },
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      conversations,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const getLastMessageForAllUsers = async (req, res) => {
  try {
    const { userID, receiverID } = req.body;
    const conversations = await Conversations.find({
      members: { $all: [userID, receiverID] },
    })
      .sort({ createdAt: -1 })
      .limit(1);

    res.status(200).json({
      success: true,
      conversations,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export default async function handler(req, res) {
  await connectMongo();

  switch (req.method) {
    case POST:
      await createConversation(req, res);
      break;
    case GET:
      await getAllConversationsForUser(req, res);
      break;
    default:
      res
        .status(404)
        .json({ success: false, message: "API endpoint not found" });
  }
}
