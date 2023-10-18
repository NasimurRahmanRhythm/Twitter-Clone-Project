import React, { useContext } from "react";
import styles from "@/src/styles/message.module.css";
import Header from "@/src/components/Header/Header";
import useUsers from "@/src/hooks/useUsers";
import Avatar from "@/src/components/Avatar/Avatar";
import { MessageContext } from "@/src/providers/MessageProvider";
import { useRouter } from "next/router";
import Link from "next/link";



const MessageView = () => {
  const { data: users = [] } = useUsers();
  if (users.length === 0) {
    return null;
  }
  const router = useRouter();
  const {room} = router.query;
  const {messages, messageNotifications, chatUsers, dispatch} = useContext(MessageContext);
  return (
    <div>
      <Header showBackArrow label="Your Messages" />
      <div className={styles.message}>
        <div className={styles.userList}>
          {users
            .filter((user) => user.isVerified === true)
            .map((user) => (
              <div key = {user._id} className={`${styles.user} ${room === user._id ? styles.selected : ""}`}>
                <Link
                style={{ position: "relative", color: "#fff" , width: "100%" }}
                key={user._id}
                href={{ pathname: "/message", query: { room: user._id } }}
              >
                <div>
                <Avatar userId={user._id} />
                <div className={styles.userInfo}>
                  <p className={styles.userName}>{user.name}</p>
                  <p className={styles.userHandle}>@{user.username}</p>
                </div>
                {messageNotifications?.has(user._id) && (
                  <span className="notification-badge"></span>
                )}
                </div>
                </Link>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default MessageView;
