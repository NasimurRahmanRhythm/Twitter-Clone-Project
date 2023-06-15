import { Avator } from "@/components/user/components/avatar/Avatar";
import styles from "./CreateTweet.module.css";
import { ImgIcon } from "@/participated/components/icons/ImgIcon";
import { useState } from "react";
import { useLoading } from "@/participated/hooks/useLoading";
import { LoadingBar } from "@/participated/components/loading-bar/LoadingBar";
import { useAutoResizeTextArea } from "@/participated/hooks/useAutoResizeTextArea";
import { FileInput } from "@/participated/components/file-reader/FileReader";
import { RxCross1 } from "react-icons/rx";
import { postTweet } from "../../services/client/create-tweet.client";
export function CreateTweet({ expanded, onComplete = () => {} }) {
  const [expand, setExpand] = useState(expanded);
  const [post, setPost] = useState();
  const textAreaRef = useAutoResizeTextArea(post);
  const loading = useLoading();
  const [image, setImage] = useState();
  const twitPost = async () => {
    if (post || image) {
      loading.start();
      try {
        const tweet = await postTweet({ text: post, image: image?.file });
        await loading.complete();
        onComplete(tweet);
      } catch (err) {
        console.log(err);
        await loading.complete();
      }
      setPost("");
      setImage(undefined);
    }
  };

  return (
    <>
      <LoadingBar loading={loading.loading} />
      <div className={styles.createPost}>
        <Avator size="48" />
        <div className={styles.fields}>
          {expand && (
            <select defaultValue="everyone" className={styles.audience}>
              <option>Everyone</option>
            </select>
          )}
          <textarea
            ref={textAreaRef}
            placeholder="What's happening"
            className={styles.textarea}
            onClick={() => {
              if (!expand) {
                setExpand(true);
              }
            }}
            value={post}
            onChange={(e) => setPost(e.target.value)}
          ></textarea>

          {image && (
            <div className={styles.image}>
              <img src={image.src} alt="img" />
              <button
                onClick={() => setImage(undefined)}
                className={`btn btn-ghost`}
              >
                <RxCross1 />
              </button>
            </div>
          )}

          {expand && (
            <>
              <select
                defaultValue="everyone"
                className={styles.audience}
                style={{ border: "none", marginLeft: "0" }}
              >
                <option value="everyone">Everyone can reply</option>
              </select>
              <div className="h-divider"></div>
            </>
          )}
          <div className={styles.actions}>
            <div className={styles.attachment}>
              <FileInput
                id={"file" + Math.random() * 100}
                onSelect={(e) => setImage(e)}
              >
                <div className="btn btn-icon">
                  <ImgIcon color="rgb(29, 155, 240)" width="22" />
                </div>
              </FileInput>
            </div>
            <div>
              <button
                onClick={twitPost}
                className={"btn btn-primary"}
                style={{ padding: "0.7rem 1rem", fontSize: "1rem" }}
              >
                Tweet
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
