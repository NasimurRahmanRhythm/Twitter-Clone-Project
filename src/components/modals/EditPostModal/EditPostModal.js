import useCurrentUser from "@/src/hooks/useCurrentUser";
import useEditPostModal from "@/src/hooks/useEditPostModal";
import usePost from "@/src/hooks/usePost";
import useUser from "@/src/hooks/useUser";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import Input from "../../Input/Input";
import Modal from "../../Modal/Modal";
import EditModal from "../EditModal/EditModal";
import useEditModal from "@/src/hooks/useEditModal";

const EditPostModal = (postId) =>{
    console.log("PostId is ", + postId);
    const editPostModal = useEditPostModal();
    const { data: post} = usePost(postId);
    const [postbody, setPostbody] = useState('');

    useEffect(()=> {
        setPostbody(post?.body);
    },[post?.body]);

    const [isLoading,setIsLoading] = useState(false);

    const onSubmit = useCallback(async() => {
        try{
            setIsLoading(true);
            await axios.patch('api/postedit', {
                postbody,
            });
            toast.success('Post Edited');
            editPostModal.onClose();
        }
        catch(error){
            toast.error("Post can not be edited");
        } finally{
            setIsLoading(false);
        }
    },[postbody,editPostModal]);

    const bodyContent = (
        <div>
            <Input
            placeholder="What is happening?"
            onChange={(e)=>setPostbody(e.target.value)}
            value={body}
            disabled={isLoading}
            />
        </div>
    )

    return (
        <Modal
        disabled={isLoading}
        isOpen={editPostModal.isOpen}
        title="Edit your post"
        actionLabel="Update"
        onClose={editPostModal.onClose}
        onSubmit={onSubmit}
        body={bodyContent}
        />
    );
}

export default EditPostModal;