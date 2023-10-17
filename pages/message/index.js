import React from "react";
import styles from "@/src/styles/message.module.css";
import Header from "@/src/components/Header/Header";
import useUsers from "@/src/hooks/useUsers";
import Avatar from "@/src/components/Avatar/Avatar";

const MessageView = () => {
  const { data: users = [] } = useUsers();
  if (users.length === 0) {
    return null;
  }
  return (
    <>
      <Header showBackArrow label="Your Messages" />
      <div className={styles.message}>
        <div className={styles.userList}>
          {users
            .filter((user) => user.isVerified === true)
            .map((user) => (
              <div key={user._id} className={styles.user}>
                <Avatar userId={user._id} />
                <div className={styles.userInfo}>
                  <p className={styles.userName}>{user.name}</p>
                  <p className={styles.userHandle}>@{user.username}</p>
                </div>
              </div>
            ))}
        </div>
      </div>
    </>
  );
};

export default MessageView;
