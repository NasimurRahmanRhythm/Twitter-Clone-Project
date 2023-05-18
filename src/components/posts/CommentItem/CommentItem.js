import { formatDistanceToNowStrict } from "date-fns";
import { useRouter } from "next/router";
import React, { useCallback, useMemo } from "react";
import Avatar from "../../Avatar/Avatar";
import styles from "./CommentItem.module.css";

const CommentItem = ({ data }) => {
  const router = useRouter();
  const goToUser = useCallback(
    (event) => {
      event.stopPropagation();
      router.push(`/users/${data.user.id}`);
    },
    [router, data.user.id]
  );

  const createdAt = useMemo(() => {
    if (!data?.createdAt) {
      return null;
    }

    return formatDistanceToNowStrict(new Date(data.createdAt));
  }, [data?.createdAt]);

  return (
    <div className={styles.commentItem}>
      <div className={styles.flexRow}>
        <Avatar userId={data.user.id} />
        <div>
          <div className={styles.userInfo}>
            <p onClick={goToUser} className={styles.userName}>
              {data.user.name}
            </p>
            <span className={styles.userUsername}>{data.user.username}</span>
            <span className={styles.createdAt}>{createdAt}</span>
          </div>
          <div className={styles.commentBody}>{data.body}</div>
        </div>
      </div>
    </div>
  );
};

export default CommentItem;
