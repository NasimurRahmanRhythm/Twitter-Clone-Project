import styles from "./PostListItem.module.css";
import { CommentIcon } from "@/participated/components/icons/CommentIcon";
import { LikeIcon } from "@/participated/components/icons/LikeIcon";
import { Content } from "../content/Content";
import { Avator } from "@/components/user/components/avatar/Avatar";
import Link from "next/link";
import { Dropdown } from "../dropdown/Dropdown";
import { useSession } from "next-auth/react";
import { RetweetIcon } from "../icons/RetweetIcon";
import { CgMoreVertical } from "react-icons/cg";
export function PostListItem({
  post = {},
  parentType,
  onClick,
  onActionClick,
}) {
  const createdAt = "1 hr ago";
  const { data: session } = useSession();
  const isMyPost = session && session?.user?.id === post?.user?.id;
  return (
    <div className={styles.postCard}>
      <Link
        onClick={(e) => e.stopPropagation()}
        href={`/profile/${post.user?.id}`}
      >
        <Avator src={post?.user?.image} />
      </Link>
      <div>
        <div className={styles.name}>
          <div>{post.user?.name}</div>
          <div>@{post.user?.username}</div>.<div>{createdAt}</div>
          {isMyPost && (
            <Dropdown
              className={`${styles.dropdown}`}
              onOptionClick={onActionClick}
              options={["edit", "delete"]}
            >
              <button className="btn btn-icon" style={{ padding: "0.5rem" }}>
                <CgMoreVertical />
              </button>
            </Dropdown>
          )}
        </div>
        <Content image={post.content?.image} content={post.content?.text} />
        <div className={styles.actions}>
          <span
            style={
              post.isLiked ? { color: "var(--pink)", fill: "var(--pink)" } : {}
            }
            className={styles.likeButton + " " + styles.actionButton}
            onClick={(e) => {
              e.stopPropagation();
              onActionClick("like");
            }}
          >
            <LikeIcon className={styles.icon} isLiked={post.isLiked} />
            {post.totalLikes?.toString()}
          </span>
          {parentType != "reply" && (
            <span
              className={styles.commentButton + " " + styles.actionButton}
              onClick={(e) => {
                e.stopPropagation();
                onActionClick("comment");
              }}
            >
              <CommentIcon className={styles.icon} />
              {post.totalReplies?.toString()}
            </span>
          )}
          {post.type != "reply" && (
            <span
              className={styles.retweetButton + " " + styles.actionButton}
              onClick={(e) => {
                e.stopPropagation();
                onActionClick("retweet");
              }}
            >
              <RetweetIcon className={styles.icon} />
              {post.totalRetweets?.toString()}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
