import connectToDB from "@/libs/mongooseDB";
import serverAuth from "@/libs/serverAuth";
import User from "@/models/User";


export default async function handler(req,res) {
    if(req.method!=='GET') {
        return res.status(405).end();
    }
    
    try {
        await connectToDB();
        const { session } = await serverAuth(req,res);
        const { type } = req.query; 
        if(type === 'message') {
            const { messageNotifications } = await User.findById(session._id).select({ messageNotifications: 1});
            return res.status(200).end(messageNotifications);
        }
    } catch (error) {
        console.log("Notification error is ",error);
        return res.status(400).end();
    }
}