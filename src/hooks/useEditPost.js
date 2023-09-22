import { useCallback } from "react";
import { toast } from "react-hot-toast";

const useEditPost = () => {
  const editPost = useCallback(async (postId, editedContent) => {
    try {
      const response = await fetch("/api/postedit", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ postId, body: editedContent }),
      });

      if (response.ok) {
        toast.success("Post edited successfully");
      } else {
        throw new Error("Failed to edit post");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Something went wrong while editing the post");
    }
  }, []);

  return {
    editPost,
  };
};

export default useEditPost;
