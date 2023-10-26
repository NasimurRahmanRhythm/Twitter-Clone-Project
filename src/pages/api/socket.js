import { Server } from "socket.io";
import mongoose from "mongoose";
import serverAuth from "@/libs/serverAuth";
import {
  deleteMessageNotification,
  seeMessage,
} from "@/libs/services/messageServices";
import connectToDB from "@/libs/mongooseDB";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).end();
  }
  try{
    await connectToDB();
    const session = await serverAuth(req, res);
    if (session) {
      await createSocket(res);
    }
    return res.status(200).json({ message: "Socket.js is working" });
  } catch(error) {
    console.log('Socket error is ', error);
        return res.status(400).end();
  }
}

export async function createSocket(res) {
  let io = res.socket.server.io;
  if (!io) {
    const io = new Server(res.socket.server);
    io.on("connection", async (socket) => {
      socket.on("join", (room) => {
        console.log("room is ", room);
        socket.join(room);
      });

      socket.on("leave", (room) => {
        console.log("room is ", room);
        socket.leave(room);
      });

      socket.on("see_message", async (message) => {
        console.log("socket seen", message._id);
        seeMessage({ messageIds: [new mongoose.Types.ObjectId(message._id)] });
        deleteMessageNotification({
          userId: message.receiver,
          notificationSenderId: message.sender,
        });
        socket
          .to(message.sender)
          .emit("message_seen", { userId: message.receiver });
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
