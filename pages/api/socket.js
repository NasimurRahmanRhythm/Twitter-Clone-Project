import { Server } from "socket.io";
import mongoose from "mongoose";
import serverAuth from "@/src/libs/serverAuth";
import { deleteMessageNotification, seeMessage } from "@/src/libs/services/messageServices";
import connectToDB from "@/src/libs/mongooseDB";

export default async (req, res) => {
  await connectToDB();
  const session = await serverAuth(req, res);
  if (!session) {
    return res.status(401).json({ error: "You must be logged in to perform this request" });
  }
  
  if (req.method === "GET") {
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
        console.log("socket seen", message.id);
        await seeMessage({ messageIds: [new mongoose.Types.ObjectId(message.id)] });
        await deleteMessageNotification({ userId: message.receiver, notificationSenderId: message.sender });
        socket.to(message.sender).emit("message_seen", { userId: message.receiver });
      });
    });
    res.socket.server.io = io;
  } else {
    res.status(404).send("Method not found");
  }
};

export const config = {
  api: {
    bodyParser: false,
  },
};

