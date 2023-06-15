import { useLoading } from "@/participated/hooks/useLoading";
import styles from "./CreatePost.module.css";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { useAutoResizeTextArea } from "@/participated/hooks/useAutoResizeTextArea";
import { FileInput } from "../file-reader/FileReader";
import { ImgIcon } from "../icons/ImgIcon";
import { RxCross1 } from "react-icons/rx";
import { Avator } from "@/components/user/components/avatar/Avatar";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { useCustomState } from "@/participated/hooks/useCustomState";
import { AsyncButton } from "../async-button/AsyncButton";
export function CreatePost({
  text,
  image,
  onSubmit = async () => {},
  submitButton = "tweet",
  placeholder = "What's happening",
  isLoading = false,
}) {
  const { data: session } = useSession();
  const imageState = useCustomState({ src: image });
  const textState = useCustomState(text);
  const textAreaRef = useAutoResizeTextArea(textState.value);
  return (
    <div className={styles.createPost}>
      <Avator src={session?.user?.image} size="48" />
      <div className={styles.fields}>
        <textarea
          ref={textAreaRef}
          placeholder={placeholder}
          className={styles.textarea}
          value={textState.value}
          onChange={(e) => textState.set(e.target.value)}
        ></textarea>
        {imageState.value?.src && imageState.value?.src !== "undefined" && (
          <div className={styles.image}>
            <img src={imageState.value?.src} alt="img" />
            <button
              onClick={() => imageState.set(undefined)}
              className={`btn btn-ghost`}
            >
              <RxCross1 />
            </button>
          </div>
        )}
        <div className={styles.actions}>
          <div className={styles.attachment}>
            <FileInput onSelect={(e) => imageState.set(e)}>
              <div className="btn btn-icon">
                <ImgIcon color="rgb(29, 155, 240)" width="22" />
              </div>
            </FileInput>
          </div>
          <div>
            <AsyncButton
              onClickAsync={async () => {
                await onSubmit({
                  text: textState.value,
                  image: imageState.value,
                });
                textState.set("");
                imageState.set({ src: "" });
              }}
              className={`btn btn-primary ${styles.submit}`}
            >
              {submitButton}
            </AsyncButton>
          </div>
        </div>
      </div>
    </div>
  );
}
