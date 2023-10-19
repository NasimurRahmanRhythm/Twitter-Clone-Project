import { useSession } from "next-auth/react";
import React, { useState } from "react";
import styles from "@/src/components/Message/MessageForm/MessageForm.module.css";
import Avatar from "../../Avatar/Avatar";
import { RxCross2 } from "react-icons/rx";
import ImageUpload from "../../ImageUpload/ImageUpload";
import Button from "../../Button/Button";

const MessageForm = ({ placeholder, onSubmit = async () => {} }) => {
  const { data: session } = useSession();
  const [text, setText] = useState();
  const [image, setImage] = useState();
  return (
    <div className={styles.message}>
      <Avatar userId={session?.user._id} />
      <div className={styles.fields}>
        <textarea
          placeholder={placeholder}
          className={styles.textarea}
          value={text}
          onChange={(e) => setText(e.target.value)}
        ></textarea>
        {image && image !== "undefined" && (
          <div className={styles.image}>
            <img src={image} alt="img" />
            <button
              onClick={() => setImage(undefined)}
              className={"btn btn-ghost"}
            >
              <RxCross2 />
            </button>
          </div>
        )}
        <div className={styles.actions}>
          <div className={styles.attachment}>
            <ImageUpload
              onChange={(image) => setImage(image)}
              label="Upload an image"
            />
          </div>
        </div>
        <Button onClick={onSubmit} label="Send" />
      </div>
    </div>
  );
};

export default MessageForm;
