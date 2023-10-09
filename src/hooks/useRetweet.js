
import { useCallback } from "react";
import useLoginModal from "./useLoginModal";
import toast from "react-hot-toast";
import axios from "axios";
import { useSession } from "next-auth/react";
import usePosts from "./usePosts";

const useRetweet = ({ postId }) => {
    const { data: currentUser } = useSession();
    const loginModal = useLoginModal();
    const { mutate: mutatePosts } = usePosts();

    const retweetPost = useCallback( async () => {
        if(!currentUser){
            return loginModal.onOpen();
        }

        try {
            await axios.post('/api/retweet', 
            {
                postId: postId,
            });
            toast.success('Post retweeted');
            mutatePosts();
        }
        catch(error){
            toast.error('Failed to retweet');
        }
    },[currentUser, postId, loginModal, mutatePosts]);
    return{
        retweetPost
    };
};

export default useRetweet;