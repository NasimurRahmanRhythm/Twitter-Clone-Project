import useCurrentUser from "@/src/hooks/useCurrentUser";
import useLoginModal from "@/src/hooks/useLoginModal";
import useLike from "@/src/hooks/useLike";
import { formatDistanceToNowStrict } from "date-fns";
import { useRouter } from "next/router";
import React, { useCallback, useMemo } from "react";
import Avatar from "../../Avatar/Avatar";
import { AiOutlineHeart, AiFillHeart, AiOutlineMessage } from "react-icons/ai";
import styles from "./PostItem.module.css";

const PostItem = ({ data, userId }) => {
  const router = useRouter();
  const loginModal = useLoginModal();
  const { data: currentUser } = useCurrentUser();
  const { hasLiked, toggleLike } = useLike({ postId: data._id, userId: data.userId_id });
  const goToUser = useCallback((ev) => {
    ev.stopPropagation();
    console.log(data);
    router.push(`/users/${data.userId._id}`);
    console.log(data.userId._id);
  }, [router, data.userId._id]);

  const goToPost = useCallback(() => {
    router.push(`/posts/${data._id}`);
  }, [router, data._id]);

  const onLike = useCallback(async (ev) => {
    ev.stopPropagation();

    if (!currentUser) {
      return loginModal.onOpen();
    }

    toggleLike();
  }, [loginModal, currentUser, toggleLike]);

  const LikeIcon = hasLiked ? AiFillHeart : AiOutlineHeart;

  const createdAt = useMemo(() => {
    if (!data?.createdAt) {
      return null;
    }

    return formatDistanceToNowStrict(new Date(data.createdAt));
  }, [data.createdAt]);
  return (
    <div onClick={goToPost} className={styles.postItem}>
      <div className={styles.flexRow}>
        <Avatar userId={data.userId._id} />
        <div>
          <div className={styles.userInfo}>
            <p onClick={goToUser} className={styles.userName}>
              {data.userId.username}
            </p>
            <span
              onClick={goToUser}
              className={`${styles.userUsername} ${styles.hiddenMd}`}
            >
              @{data.userId.username}
            </span>
            <span className={styles.createdAt}>{createdAt}</span>
          </div>
          <div className={styles.postBody}>{data.body}</div>
          <div className={styles.actions}>
            <div className={`${styles.actionItem} ${styles.commentAction}`}>
              <AiOutlineMessage size={20} />
              <p>{data.comments?.length || 0}</p>
            </div>
            <div
              onClick={onLike}
              className={`${styles.actionItem} ${styles.likeAction}`}
            >
              <LikeIcon size={20} color={hasLiked ? "red" : ""} />
              <p>{data.likedIds.length}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostItem;
