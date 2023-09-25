import useLoginModal from "@/src/hooks/useLoginModal";
import usePosts from "@/src/hooks/usePosts";
import useRegisterModal from "@/src/hooks/useRegisterModal";
import axios from "axios";
import React, { useCallback, useState } from "react";
import { toast } from "react-hot-toast";
import Avatar from "../Avatar/Avatar";
import usePost from "@/src/hooks/usePost";
import styles from "./Form.module.css";
import useCurrentUser from "@/src/hooks/useCurrentUser";
import Button from "../Button/Button";
import { BsFileImage } from "react-icons/bs";

const Form = ({ placeholder, isComment, postId }) => {
  const registerModal = useRegisterModal();
  const loginModal = useLoginModal();

  const { data: currentUser } = useCurrentUser();
  const { mutate: mutatePosts } = usePosts();
  const { mutate: mutatePost } = usePost(postId);

  const [body, setBody] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isImageSelected, setIsImageSelected] = useState(false);

  const handleImageUpload = async () => {
    setIsImageSelected(true);
    try {
      if (!selectedFile) return;
      const formData = new FormData();
      formData.append("myImage", selectedFile);
      const { data } = await axios.post("/api/image", formData);
      console.log(data);
      setSelectedImage(data.imageUrl); // Store the image URL returned by the server
    } catch (error) {
      console.log(error.response?.data);
    }
    setIsImageSelected(false); // Reset the flag after image upload
  };

  const onSubmit = useCallback(async () => {
    try {
      setIsLoading(true);

      const url = isComment ? `/api/comments?postId=${postId}` : "/api/posts";
      const postData = { body };

      if (isImageSelected) {
        // If an image is selected, include its URL in the post data
        postData.image = selectedImage;
      }

      await axios.post(url, postData);

      toast.success("Tweet Created");
      setBody("");
      setSelectedImage("");
      setSelectedFile(null);
      setIsImageSelected(false);
      mutatePosts();
      mutatePost();
    } catch (error) {
      toast.error("Something is wrong");
    } finally {
      setIsLoading(false);
    }
  }, [body, mutatePosts, mutatePost, isComment, postId, isImageSelected, selectedImage]);

  return (
    <div className={styles.formContainer}>
      {currentUser ? (
        <div className={styles.userForm}>
          <div>
            <Avatar userId={currentUser?.id} />
          </div>
          <div className={styles.textareaWrapper}>
            <textarea
              disabled={isLoading}
              onChange={(e) => setBody(e.target.value)}
              value={body}
              className={`${styles.textarea} ${
                isLoading ? styles.disabledOpacity : ""
              }`}
              placeholder={placeholder}
            ></textarea>
            <hr
              className={`${styles.hr} ${
                isLoading ? styles.peerFocusOpacity : ""
              }`}
            />
            <div className={styles.buttonWrapper}>
              <Button
                disabled={isLoading}
                onChange={({ target }) => {
                  if (target.files) {
                    const file = target.files[0];
                    setSelectedImage(URL.createObjectURL(file));
                    setSelectedFile(file);
                  }
                }}
                onClick={handleImageUpload}
                label="Img"
              />
              <BsFileImage />
              <Button
                disabled={isLoading || (!body && !isImageSelected)}
                onClick={onSubmit}
                label="Tweet"
              />
            </div>
          </div>
        </div>
      ) : (
        <div className={styles.welcomeContainer}>
          <h1 className={styles.welcomeTitle}>Welcome here</h1>
          <div className={styles.buttonGroup}>
            <Button label="Login" onClick={loginModal.onOpen} />
            <Button label="Register" onClick={registerModal.onOpen} secondary />
          </div>
        </div>
      )}
    </div>
  );
};

export default Form;
