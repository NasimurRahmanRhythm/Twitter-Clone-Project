import Conversation from "@/main/models/conversation.schema";
import { mapId } from "@/participated/libs/mapId";

export async function getAllConversationsForUser({
  userId,
  receiverID,
  pageIndex,
  pageSize = 1,
}) {
  try {
    const fetchedConversations = await Conversation.findOne({
      members: { $all: [userId, receiverID] },
    }).sort({ createdAt: -1 });

    if (fetchedConversations && fetchedConversations.messages) {
      fetchedConversations?.messages.forEach((message) => {
        if (message.sender.toString() !== userId) {
          message.seen = true;
        }
      });
      await fetchedConversations.save();
    }

    const conversations = await Conversation.find({
      members: { $all: [userId, receiverID] },
    })
      .select("messages")
      .skip((pageIndex - 1) * pageSize)
      .limit(pageSize)
      .sort({ createdAt: -1 })
      .lean();

    if (conversations[0]?.messages?.length < 20) {
      const moreConversations = await Conversation.find({
        members: { $all: [userId, receiverID] },
      })
        .select("messages")
        .skip((pageIndex - 1) * (pageSize + 1))
        .limit(pageSize + 1)
        .sort({ createdAt: -1 })
        .lean();

      if (moreConversations.length > 1) {
        const firstConversationMessages =
          moreConversations[1]?.messages?.map((msg) => mapId(msg)) || [];
        const secondConversationMessages =
          moreConversations[0]?.messages?.map((msg) => mapId(msg)) || [];
        return [...firstConversationMessages, ...secondConversationMessages];
      } else {
        return conversations[0]?.messages?.map((msg) => mapId(msg)) || [];
      }

      //return moreConversations?.messages.map((msg) => mapId(msg)) || [];
    } else {
      return conversations[0]?.messages?.map((msg) => mapId(msg)) || [];
    }

    //console.log(conversations);
  } catch (error) {
    throw { status: 500, message: error.message };
  }
}
