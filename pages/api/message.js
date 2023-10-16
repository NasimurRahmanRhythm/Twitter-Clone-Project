import connectToDB from "@/src/libs/mongooseDB";
import serverAuth from "@/src/libs/serverAuth";
import { createMessage, createMessageNotification } from "@/src/libs/services/messageServices";
import { createSocket } from "./socket";


export default async function handler(req,res) {
    if(req.method!=='POST') {
        return res.status(405).end();
    }

    try {

        await connectToDB();
        const session = await serverAuth(req,res);
        const {content, sender, receiver, customId} = req.body;
        const newMessage = await createMessage({
            sender: session.user?._id,
            receiver: receiver,
            text: content.text,
        });

        createMessageNotification({ userId: receiver, notificationSenderId: sender});
        await createSocket(res);
        let io = res.socket.server.io;
        io?.in(receiver).emit("new_message", newMessage);

        return res.status(200).end({data: {message: newMessage, customId}});

    } catch(error){
        console.log("message.js error is ",error);
        res.status(400).end();
    }
}