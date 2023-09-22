import Post from "@/Twitter-Clone-Project/src/models/Post";
import connectToDB from "@/src/libs/mongooseDB";
import serverAuth from "@/src/libs/serverAuth";


export default async function handler(req, res) {
    console.log(req);
    if(req.method !== "DELETE") {
        return res.status(405).end();
    }

    try{
        await connectToDB();
        const { postId } = req.body;
        const { currentUser } = await serverAuth(req, res);

        if(!postId || typeof postId !== "string") {
            throw new Error("Invalid Id");
        }
        // console.log("Post id is " + postId);
        const post = await Post.findByIdAndDelete(postId);
        if(!post){
            throw new Error("Post not found");
        }

        return res.status(200).json({ message: "Post deleted successfully"});
    }catch(error){
        console.log("Delete related error " + error);
        return res.status(400).json({ error: "Failed to delete post"});
    }
}