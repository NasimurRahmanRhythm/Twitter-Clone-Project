import useCurrentUser from '@/hooks/useCurrentUser';
import useLoginModal from '@/hooks/useLoginModal';
import useLike from '@/hooks/useLike';
import { formatDistanceToNowStrict } from 'date-fns';
import { useRouter } from 'next/router';
import React, { useCallback, useMemo } from 'react';
import Avatar from '../Avatar';
import { AiOutlineHeart, AiFillHeart, AiOutlineMessage } from 'react-icons/ai';
import styles from './PostItem.module.css';

const PostItem = ({ data, userId }) => {
  const router = useRouter();
  const loginModal = useLoginModal();
  const { data: currentUser } = useCurrentUser();
  const { hasLiked, toggleLike } = useLike({ postId: data.id, userId });
  const goToUser = useCallback(
    (event) => {
      event.stopPropagation();

      router.push(`/users/${data.user.id}`);
    },
    [router, data.user.id]
  );

  const goToPost = useCallback(() => {
    router.push(`/posts/${data.id}`);
  }, [router, data.id]);

  const onLike = useCallback(
    (event) => {
      event.stopPropagation();

      if (!currentUser) {
        return loginModal.onOpen();
      }
      toggleLike();
    },
    [loginModal, currentUser, toggleLike]
  );

  const createdAt = useMemo(() => {
    if (!data?.createdAt) {
      return null;
    }

    return formatDistanceToNowStrict(new Date(data.createdAt));
  }, [data?.createdAt]);

  const LikeIcon = hasLiked ? AiFillHeart : AiOutlineHeart;
  return (
    <div onClick={goToPost} className={styles.postItem}>
      <div className={styles.flexRow}>
        <Avatar userId={data.user.id} />
        <div>
          <div className={styles.userInfo}>
            <p onClick={goToUser} className={styles.userName}>
              {data.user.name}
            </p>
            <span
              onClick={goToUser}
              className={`${styles.userUsername} ${styles.hiddenMd}`}
            >
              @{data.user.username}
            </span>
            <span className={styles.createdAt}>{createdAt}</span>
          </div>
          <div className={styles.postBody}>{data.body}</div>
          <div className={styles.actions}>
            <div
              className={`${styles.actionItem} ${styles.commentAction}`}
            >
              <AiOutlineMessage size={20} />
              <p>{data.comments?.length || 0}</p>
            </div>
            <div
              onClick={onLike}
              className={`${styles.actionItem} ${styles.likeAction}`}
            >
              <LikeIcon size={20} color={hasLiked ? 'red' : ''} />
              <p>{data.likedIds.length}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostItem;
