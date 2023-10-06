import connectToDB from "@/src/libs/mongooseDB";
import User from "@/src/models/User";

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
        
        const followingNames = [];
        for(const id of user.followingIds) {
            const followingUser = await User.findById(id);
            if(followingUser){
                followingNames.push(followingUser.username);
            }
        }
       return res.status(200).json(followingNames); 

    } catch(error){
        console.log(error);
        return res.status(400).end();
    }
}