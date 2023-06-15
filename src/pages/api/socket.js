import { handleRequest } from "@/participated/middlewares/request-handler";
import { getServerSession } from "next-auth";
import { Server } from "socket.io";
import { createOptions } from "./auth/[...nextauth]";
import { seeMessage } from "@/components/conversation/services/server/seeMessage.server";
import {
  CONNECTION,
  JOIN,
  LEAVE,
  MESSAGE_SEEN,
  SEE_MESSAGE,
} from "@/constants";
import mongoose from "mongoose";
import { deleteMessageNotification } from "@/components/notification/services/server/delete-message-notification.server";

export default handleRequest({
  GET: async (req, res) => {
    const session = await getServerSession(req, res, createOptions(req));
    if (session) {
      console.log("session", session.user.id);
      await createSocketConnection(res);
    }
    res.json({ success: true });
  },
});

export async function createSocketConnection(res) {
  let io = res.socket.server.io;
  if (!io) {
    const io = new Server(res.socket.server);
    io.on(CONNECTION, async (socket) => {
      // io.to(socket.id).emit("JOIN_REQUEST",{})
      // socket.join(session.user?.id)
      // console.log("join", session.user?.id)

      // socket.on(SEND_MESSAGE, async ({ content, sender, receiver }) => {
      //   const newMessage = await createMessage({
      //     sender: sender,
      //     receiver: receiver,
      //     text: content.text,
      //   });
      //   createMessageNotification({
      //     userId: receiver,
      //     notificationSenderId: sender,
      //   });
      //   io.to(socket.id).emit(NEW_MESSAGE, newMessage);
      //   socket.to(receiver).emit(NEW_MESSAGE, newMessage);
      // });

      socket.on(JOIN, (room) => {
        console.log("room is ", room);
        socket.join(room);
      });

      socket.on(LEAVE, (room) => {
        console.log("room is ", room);
        socket.leave(room);
      });

      socket.on(SEE_MESSAGE, async (message) => {
        console.log("socket seen", message.id);
        seeMessage({ messageIds: [new mongoose.Types.ObjectId(message.id)] });
        deleteMessageNotification({
          userId: message.receiver,
          notificationSenderId: message.sender,
        });
        socket
          .to(message.sender)
          .emit(MESSAGE_SEEN, { userId: message.receiver });
      });
    });
    res.socket.server.io = io;
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};
