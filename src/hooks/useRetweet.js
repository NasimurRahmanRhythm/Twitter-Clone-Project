
import { useCallback } from "react";
import useCurrentUser from "./useCurrentUser";
import useLoginModal from "./useLoginModal";
import toast from "react-hot-toast";
import axios from "axios";

const useRetweet = ({ postId }) => {
    const { data: currentUser } = useCurrentUser();
    const loginModal = useLoginModal();

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
        }
        catch(error){
            toast.error('Failed to retweet');
        }
    },[currentUser, postId, loginModal]);
    return{
        retweetPost
    };
};

export default useRetweet;