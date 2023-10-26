import connectToDB from "@/libs/mongooseDB";
import User from "@/models/User";

export default async function handler(req, res) {
    if(req.method !== "POST") {
        return res.status(405).end();
    }

    try {
        await connectToDB();
        const { userId } = req.body;
        if(!userId) {
            throw new Error('Invalid ID');
        }

        const user = await User.findById(userId);
        
        const followerNames = await User.find({
            _id: { $in: user.followerIds },
        }).select('username');

       return res.status(200).json(followerNames); 

    } catch(error){
        console.log(error);
        return res.status(400).end();
    }
}