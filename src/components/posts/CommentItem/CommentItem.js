import { formatDistanceToNowStrict } from "date-fns";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import Avatar from "../../Avatar/Avatar";
import styles from "./CommentItem.module.css";
import axios from "axios"; 
import useUser from "@/src/hooks/useUser";
import {
  AiOutlineHeart,
  AiFillHeart,
  AiOutlineMessage,
  AiFillEdit,
  AiOutlineRetweet,
  AiOutlineDelete,
} from "react-icons/ai";
import useLoginModal from "@/src/hooks/useLoginModal";
import useCurrentUser from "@/src/hooks/useCurrentUser";
import useEditPostModal from "@/src/hooks/useEditPostModal";
import useLike from "@/src/hooks/useLike";
import useDelete from "@/src/hooks/useDelete";
import useRetweet from "@/src/hooks/useRetweet";

const CommentItem = ({ id }) => {
  const router = useRouter();
  const [postData, setPostData] = useState(null);
  const [fetchedUser, setFetchedUser] = useState(null);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true); 
      try {
        const response = await axios.get(`/api/posts/${id}`);
        setPostData(response.data);
      } catch (error) {
        console.error("Error fetching post data:", error);
      } finally {
        setIsLoading(false); 
      }
    };

    fetchData();
  }, [id]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (postData && postData.userId) {
        setIsLoading(true); 
        try {
          const response = await axios.get(`/api/users/${postData.userId}`);
          setFetchedUser(response.data);
        } catch (error) {
          console.error("Error fetching user data:", error);
        } finally {
          setIsLoading(false); 
        }
      }
    };

    fetchUserData();
  }, [postData]);

  if (!postData || !fetchedUser) {
    return null;
  }

  
  const loginModal = useLoginModal();
  const editPostModal = useEditPostModal();
  const { data: currentUser } = useCurrentUser();
  const { hasLiked, toggleLike } = useLike({
    postId: postData._id,
    userId: fetchedUser._id,
  });
  const { deletePost } = useDelete({ postId: postData._id });
  const { retweetPost } = useRetweet({ postId: postData._id});

  const goToUser = useCallback(
    (ev) => {
      ev.stopPropagation();
      router.push(`/users/${fetchedUser._id}`);
      console.log(fetchedUser._id);
    },
    [router, fetchedUser._id]
  );

  const goToPost = useCallback(() => {
    router.push(`/posts/${postData._id}`);
  }, [router, postData._id]);

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
      editPostModal.onOpen(postData._id);
      // return <EditPostModal postId={data._id} />;
    },
    [editPostModal, loginModal, postData._id, currentUser]
  );

  const createdAt = useMemo(() => {
    if (!postData?.createdAt) {
      return null;
    }

    return formatDistanceToNowStrict(new Date(postData.createdAt));
  }, [postData.createdAt]);

  return (
    <div onClick={goToPost} className={styles.postItem}>
        <div className={styles.flexColumn}>
         { postData.isRetweet === true ? (
           <div className={styles.topRow}>
            <div className={styles.tweetIcon}>
              <AiOutlineRetweet size={20} />
            </div>
            <div className={styles.repostText}>
              You reposted
            </div>
          </div>
         ): null }
          <div className={styles.userInfo}>
            <Avatar userId={fetchedUser._id} />
            <div className={styles.userDetails}>
              <p onClick={goToUser} className={styles.userName}>
                {fetchedUser.username}
              </p>
              <span
                onClick={goToUser}
                className={`${styles.userUsername} ${styles.hiddenMd}`}
              >
                @{fetchedUser.username}
              </span>
              <span className={styles.createdAt}>{createdAt}</span>
            </div>
          </div>
          <div className={styles.postBody}>{postData.body}</div>
          {data.image && (
            <img
              src={postData.image}
              alt="Post Image"
              className={styles.postImage}
            />
          )}
          <div className={styles.actions}>
            <div className={`${styles.actionItem} ${styles.commentAction}`}>
              <AiOutlineMessage size={20} />
              <p>{postData.comments?.length || 0}</p>
            </div>
            <div
              onClick={onLike}
              className={`${styles.actionItem} ${styles.likeAction}`}
            >
              <LikeIcon size={20} color={hasLiked ? "red" : ""} />
              <p>{postData.likedIds.length}</p>
            </div>
            {currentUser && currentUser._id === fetchedUser._id && postData.isRetweet === false ? (
              <div
                onClick={onEdit}
                className={`${styles.actionItem} ${styles.editAction}`}
              >
                <AiFillEdit size={20} />
              </div>
            ) : null}
            <div
              onClick={onRetweet}
              className={`${styles.actionItem} ${styles.retweetAction}`}
            >
              <AiOutlineRetweet size={20} />
            </div>
            {currentUser && currentUser._id === fetchedUser._id ? (
              <div
                onClick={onDelete}
                className={`${styles.actionItem} ${styles.deleteAction}`}
              >
                <AiOutlineDelete size={20} />
              </div>
            ) : null}
          </div>
        </div>
      </div>
  );
};

export default CommentItem;
