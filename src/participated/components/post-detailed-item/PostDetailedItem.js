import { useToggle } from "@/participated/hooks/useToggle";
import { useState } from "react";
import styles from "./PostDetailedItem.module.css";
import { MiniProfile } from "../mini-profile/MiniProfile";
import { LikeIcon } from "../icons/LikeIcon";
import { CommentIcon } from "../icons/CommentIcon";
import { Content } from "../content/Content";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Dropdown } from "../dropdown/Dropdown";
import { useRouter } from "next/router";

export function PostDetailedItem({ post, onActionClick, onClick }) {
  const createdAt = new Date(post.createdAt).toDateString();
  const { data: session, status } = useSession();
  const router = useRouter();
  const isMyPost = session?.user?.id === post.user.id;
  return (
    <div className={styles.post} onClick={onClick}>
      <MiniProfile
        onClick={() => router.push("/profile/" + post?.user?.id)}
        user={post?.user}
        action={
          isMyPost && (
            <Dropdown
              options={["edit", "delete"]}
              onOptionClick={onActionClick}
            />
          )
        }
      />
      <div className={styles.content}>
        <Content image={post?.content?.image} content={post?.content?.text} />
      </div>
      <div className={styles.date}>{createdAt}</div>
      <div className="h-divider"></div>
      <div className={styles.numbers}>
        <span>
          {" "}
          <span className={styles.number}>
            {" "}
            {post.totalLikes.toString()}{" "}
          </span>{" "}
          likes
        </span>
        <span>
          {" "}
          <span className={styles.number}>
            {" "}
            {post.totalReplies.toString()}{" "}
          </span>{" "}
          comments
        </span>
      </div>
      <div className="h-divider"></div>

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
          <LikeIcon className={styles.likeIcon} isLiked={post.isLiked} />{" "}
        </span>
        <span
          className={styles.commentButton + " " + styles.actionButton}
          onClick={(e) => {
            e.stopPropagation();
            onActionClick("comment");
          }}
        >
          <CommentIcon className={styles.commentIcon} />
        </span>
      </div>
    </div>
  );
}
