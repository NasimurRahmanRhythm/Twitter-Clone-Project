import { createMessage } from "@/components/conversation/services/server/create-message.server";
import { createMessageNotification } from "@/components/notification/services/server/create-message-notification.server";
import { handleRequest } from "@/participated/middlewares/request-handler";
import { createSocketConnection } from "../socket";
import { NEW_MESSAGE } from "@/constants";
import { getServerSession } from "next-auth";
import { createOptions } from "../auth/[...nextauth]";

export default handleRequest({
  POST: async (req, res) => {
    const { content, sender, receiver, customId } = req.body;
    const session = await getServerSession(req, res, createOptions(req));
    const newMessage = await createMessage({
      sender: session.user?.id,
      receiver: receiver,
      text: content.text,
    });

    createMessageNotification({
      userId: receiver,
      notificationSenderId: sender,
    });

    await createSocketConnection(res);

    let io = res.socket.server.io;

    io?.in(receiver).emit(NEW_MESSAGE, newMessage);

    return res.json({
      success: true,
      error: null,
      data: { message: newMessage, customId },
    });
  },
});
