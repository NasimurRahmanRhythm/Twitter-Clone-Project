import useLoginModal from "@/hooks/useLoginModal";
import useLike from "@/hooks/useLike";
import { formatDistanceToNowStrict } from "date-fns";
import { useRouter } from "next/router";
import React, { useCallback, useMemo, useState } from "react";
import Avatar from "../../Avatar/Avatar";
import {
  AiOutlineHeart,
  AiFillHeart,
  AiOutlineMessage,
  AiFillEdit,
  AiOutlineRetweet,
  AiOutlineDelete,
} from "react-icons/ai";

import styles from "./PostItem.module.css";
import useDelete from "@/hooks/useDelete";
import useEditPostModal from "@/hooks/useEditPostModal";
import EditPostModal from "../../modals/EditPostModal/EditPostModal";
import useRetweet from "@/hooks/useRetweet";
import { useSession } from "next-auth/react";
import CommentFeed from "../CommentFeed/CommentFeed";

const PostItem = ({ data, userId }) => {
  // ("Data in the console.logcomment is ", data);
  const router = useRouter();
  const loginModal = useLoginModal();
  const editPostModal = useEditPostModal();
  const { data: currentUser } = useSession();
  const { hasLiked, toggleLike } = useLike({
    postId: data._id,
    userId: data.userId_id,
  });
  const { deletePost } = useDelete({ postId: data._id });
  const { retweetPost } = useRetweet({ postId: data._id });

  const [showComment,setShowComment] = useState(false);

  const goToUser = useCallback(
    (ev) => {
      ev.stopPropagation();
      //console.log(data);
      router.push(`/users/${data.userId._id}`);
      //console.log(data.userId._id);
    },
    [router, data.userId._id]
  );

  const goToPost = useCallback(() => {
    if(showComment){
      router.push(`/posts/${data._id}`);
    }
  }, [router, data._id]);

  const onLike = useCallback(
    async (ev) => {
      ev.stopPropagation();

      if (!currentUser) {
        return loginModal.onOpen();
      }

      toggleLike();
    },
    [loginModal, currentUser, toggleLike]
  );

  const LikeIcon = hasLiked ? AiFillHeart : AiOutlineHeart;

  const onDelete = useCallback(
    (ev) => {
      ev.stopPropagation();
      if (!currentUser) return loginModal.onOpen();

      deletePost();
    },
    [loginModal, currentUser, deletePost]
  );

  const onRetweet = useCallback(
    (ev) => {
      ev.stopPropagation();
      if (!currentUser) return loginModal.onOpen();

      retweetPost();
    },
    [loginModal, currentUser, retweetPost]
  );

  const onEdit = useCallback(
    (ev) => {
      ev.stopPropagation();
      if (!currentUser) return loginModal.onOpen();
      editPostModal.onOpen(data._id);
      // return <EditPostModal postId={data._id} />;
    },
    [editPostModal, loginModal, data._id, currentUser]
  );

  const goToComment = useCallback(
    (ev)=> {
      ev.stopPropagation();
      setShowComment(!showComment);
    }
  )
  const createdAt = useMemo(() => {
    if (!data?.createdAt) {
      return null;
    }

    return formatDistanceToNowStrict(new Date(data.createdAt));
  }, [data.createdAt]);
  return (
    <div className={styles.postItem} onClick={goToPost}>
      <div className={styles.flexColumn} onClick={goToPost}>
        {data.isRetweet === true ? (
          <div>
            <div className={styles.topRow}>
              <div className={styles.tweetIcon}>
                <AiOutlineRetweet size={20} />
              </div>
              {currentUser?.user._id !== data.userId._id ? (
                <div className={styles.repostText}>
                  {data.userId.username} reposted
                </div>
              ) : (
                <div className={styles.repostText}>You reposted</div>
              )}
            </div>
            <div className={styles.userInfo}>
              <Avatar userId={data.userId._id} />
              <div className={styles.userDetails}>
                <p onClick={goToUser} className={styles.userName}>
                  {data.parentRetweet}
                </p>
                <span className={styles.createdAt}>{createdAt}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className={styles.userInfo}>
            <Avatar userId={data.userId._id} />
            <div className={styles.userDetails}>
              <p onClick={goToUser} className={styles.userName}>
                {data.userId.username}
              </p>
              <span className={styles.createdAt}>{createdAt}</span>
            </div>
          </div>
        )}
        <div className={styles.postBody}>{data.body}</div>
        {data.image && (
          <img src={data.image} alt="Post Image" className={styles.postImage} />
        )}
        <div className={styles.actions}>
          {data.type !== "reply" ? (
            <div
              onClick={goToComment}
              className={`${styles.actionItem} ${styles.commentAction}`}
            >
              <AiOutlineMessage size={20} />
              <p>{data.comments?.length + data.replies?.length || 0}</p>
            </div>
          ) : null}
          <div
            onClick={onLike}
            className={`${styles.actionItem} ${styles.likeAction}`}
          >
            <LikeIcon size={20} color={hasLiked ? "red" : ""} />
            <p>{data.likedIds.length}</p>
          </div>
          {currentUser &&
          currentUser?.user._id === data.userId._id &&
          data.isRetweet === false ? (
            <div
              onClick={onEdit}
              className={`${styles.actionItem} ${styles.editAction}`}
            >
              <AiFillEdit size={20} />
            </div>
          ) : null}
          {data.type === "post" ? (
            <div
              onClick={onRetweet}
              className={`${styles.actionItem} ${styles.retweetAction}`}
            >
              <AiOutlineRetweet size={20} />
            </div>
          ) : null}
          {currentUser && currentUser?.user._id === data.userId._id ? (
            <div
              onClick={onDelete}
              className={`${styles.actionItem} ${styles.deleteAction}`}
            >
              <AiOutlineDelete size={20} />
            </div>
          ) : null}
        </div>
        <div>
        {
      showComment ? <CommentFeed comments={data} /> : null
    }
        </div>
      </div>
    </div>
  );
};

export default PostItem;
