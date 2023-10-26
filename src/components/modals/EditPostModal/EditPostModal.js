
import useEditPostModal from "@/hooks/useEditPostModal";
import usePost from "@/hooks/usePost";
import useUser from "@/hooks/useUser";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import Input from "../../Input/Input";
import Modal from "../../Modal/Modal";
import EditModal from "../EditModal/EditModal";
import useEditModal from "@/hooks/useEditModal";
import { useStore } from "zustand";
import Form from "../../Form/Form";
import axios from "axios";
import ImageUpload from "../../ImageUpload/ImageUpload";
import styles from "./EditPostModal.module.css"
import { mutate } from "swr";
import usePosts from "@/hooks/usePosts";

const EditPostModal = () => {
  const editPostModal = useEditPostModal();
  const { data: post } = usePost(editPostModal.postId);
  const { mutate : mutatePosts } = usePosts();
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
      await axios.put(`/api/posts/${editPostModal.postId}`, {
        postId: editPostModal.postId,
        body,
        image,
      });
      mutatePosts();
      toast.success("Post Edited");
      editPostModal.onClose();
    } catch (error) {
      toast.error("Post can not be edited");
    } finally {
      setIsLoading(false);
    }
  }, [body, image, editPostModal.postId, mutatePosts, editPostModal]);

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
