import toast from "react-hot-toast";
import axios from "axios"; 
import usePost from "./usePost";
import { useCallback } from "react"; 
import useCurrentUser from "./useCurrentUser";
import useLoginModal from "./useLoginModal";

const useDelete = ({ postId }) => {
  const { data: currentUser } = useCurrentUser();
  const loginModal = useLoginModal();
  
  const deletePost = useCallback(async () => {
    if (!currentUser) {
      return loginModal.onOpen();
    }
    
    try {
      await axios.delete('/api/delete', { data: { postId } });
      //mutateFetchedPosts();

      toast.success('Post deleted successfully');
    } catch (error) {
      toast.error('Failed to delete post');
    }
  }, [currentUser, postId, loginModal]);

  return {
    deletePost
  };
};

export default useDelete;
