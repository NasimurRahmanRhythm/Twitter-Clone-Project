import connectToDB from "@/src/libs/mongooseDB";
import serverAuth from "@/src/libs/serverAuth";
import Post from "@/src/models/Post";

export default async function handler(req,res) {
    if(req.method!== 'POST'){
        return res.status(405).end();
    }

    try{
        await connectToDB();
        const { postId } = req.body;
        const { currentUser } = await serverAuth(req, res);

        const retweetpost = await Post.findById(postId);
        console.log('retweetPost is ', retweetpost);
        if(!retweetpost){
            throw new Error('Post not found');
        }

       const post = new Post({
            ...retweetpost.toObject(),
            userId: currentUser._id,
            isRetweet: true,
            _id: undefined,
            createdAt: undefined,
            updatedAt: undefined,
       });

       await post.save();

       return res.status(200).json(post);

    } catch(error) {
        console.log('Retweet error is ', error);
        return res.status(400).end();
    }
}