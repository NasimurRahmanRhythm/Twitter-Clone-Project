import connectToDB from "@/src/libs/mongooseDB";
import serverAuth from "@/src/libs/serverAuth";
import { getAllConversationsByUser } from "@/src/libs/services/messageServices";


export default async function handler(req, res){
    if(req.method!=='POST'){
        return res.status(405).end();
    }

    try {
        await connectToDB();
        const { session } = await serverAuth(req,res);
        const { receiverID } = req.body;
        const { pageIndex, pageSize } = req.query;
        const messages = await getAllConversationsByUser({
            userId: session._id,
            receiverID,
            pageIndex:+pageIndex,
            pageSize:+pageSize,
        }) 

        return res.status(200).end(messages);
    } catch(error) {
        console.log("Conversation. js error is ", error);
        return res.status(400).end();
    }
}