import connectToDB from "@/libs/mongooseDB";
import { getAllConversationsByUser } from "@/libs/services/messageServices";
import { getServerSession } from "next-auth";
import { AuthOptions } from "./auth/[...nextauth]";
import serverAuth from "@/libs/serverAuth";


export default async function handler(req, res){
    if(req.method!=='POST'){
        return res.status(405).end();
    }

    try {
        await connectToDB();
        const { receiverID } = req.body;
        const { currentUser } = await serverAuth(req, res);

        console.log("Conversationjs session is ",currentUser);
        const { pageIndex, pageSize } = req.query;
        const messages = await getAllConversationsByUser({
            userId: currentUser._id,
            receiverID,
            pageIndex: +pageIndex,
            pageSize: +pageSize,
        }) 

        return res.status(200).end(JSON.stringify(messages));
    } catch(error) {
        console.log("Conversation. js error is ", error);
        return res.status(400).end();
    }
}