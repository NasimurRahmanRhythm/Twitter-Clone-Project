import connectToDB from "@/libs/mongooseDB";
import serverAuth from "@/libs/serverAuth";
import { deleteMessageNotification } from "@/libs/services/messageServices";


export default async function handler(req,res) {
    if(req.method!=='DELETE'){
        return res.status(405).end();
    }

    try {
        await connectToDB();
        const { session } = await serverAuth(req,res);
        const { type, _id } = req.query;
        if(type === 'message') {
            await deleteMessageNotification({ userId: session._id, notificationSenderId: _id});
        }
        return res.status(200).end();
    } catch (error) {
        console.log(error);
        return res.status(400).end();
    }
} 