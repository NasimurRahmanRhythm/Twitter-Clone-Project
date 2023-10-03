import Post from "@/src/models/Post";
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
        const post = await Post.findById(postId);
        if(!post){
            throw new Error("Post not found");
        }

        if(post.type !== 'post'){

            const mainPost = await Post.findById(post.parent);

            if (!mainPost) {
                throw new Error("Main post not found");
            }
            if(mainPost.parent){
                const mainPostPost = await Post.findById(mainPost.parent);
                await mainPostPost.updateOne({ $pull: {replies: mainPost._id}});
                await mainPost.updateOne({ $pull: { comments: postId } });
            }
            else{
                for (const replyId of post.comments){
                    await mainPost.updateOne({ $pull: { replies: replyId}})
                }
                await mainPost.updateOne({ $pull: { comments: postId } });

            }
        }
        if(post.type !== 'reply') {
            for(const commentId of post.comments){
                const comment = await Post.findByIdAndDelete(commentId);
            }
            for (const replyId of post.replies){
                const reply = await Post.findByIdAndDelete(replyId);
            }

        }
        const post2 = await Post.findByIdAndDelete(postId);
        if(!post2){
            throw new Error("Post not found");
        }

        return res.status(200).json({ message: "Post deleted successfully"});
    }catch(error){
        console.log("Delete related error " + error);
        return res.status(400).json({ error: "Failed to delete post"});
    }
}