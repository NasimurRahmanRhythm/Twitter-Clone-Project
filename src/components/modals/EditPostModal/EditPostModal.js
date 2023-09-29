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
import { useStore } from "zustand";
import Form from "../../Form/Form";
import axios from "axios";
import ImageUpload from "../../ImageUpload/ImageUpload";
import styles from "./EditPostModal.module.css"

const EditPostModal = () => {
  const editPostModal = useEditPostModal();
  const { data: post } = usePost(editPostModal.postId);
  console.log("Post is ", post);
  const [body, setBody] = useState("");
  const [image, setImage]= useState("");

  useEffect(() => {
    setBody(post?.body);
    setImage(post?.image);
  }, [post?.body, post?.image]);

  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = useCallback(async () => {
    try {
      setIsLoading(true);
      await axios.patch('/api/postedit', {
        postId: editPostModal.postId,
        body,
        image,
      });
      toast.success("Post Edited");
      editPostModal.onClose();
    } catch (error) {
      toast.error("Post can not be edited");
    } finally {
      setIsLoading(false);
    }
  }, [body, image, editPostModal.postId, editPostModal]);

  const bodyContent = (
    <div className={styles.content}>
      <Input
        placeholder="What is happening?"
        onChange={(e) => setBody(e.target.value)}
        value={body}
        disabled={isLoading}
      />
      <ImageUpload
        value={image}
        disabled={isLoading}
        onChange={(image) => setImage(image)}
        label="Update the Image"
      />
    </div>
  );

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
};

export default EditPostModal;
