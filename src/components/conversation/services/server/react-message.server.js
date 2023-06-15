import Conversation from "@/main/models/conversation.schema";

export async function reactMessage(msgID, conversationID, userID, react) {
  try {
    const conversation = await Conversation.findById(conversationID);

    const message = conversation.messages.find((msg) => msg._id === msgID);
    if (message.sender === userID) {
      message.senderReact = react;
    } else {
      message.receiverReact = react;
    }
    await message.save();
    return message;
  } catch (error) {
    throw { status: 500, error: error.message };
  }
}
