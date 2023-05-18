import { BsTwitter } from "react-icons/bs";

import useNotifications from "@/src/hooks/useNotifications";
import useCurrentUser from "@/src/hooks/useCurrentUser";
import { useEffect } from "react";

import styles from "./NotificationsFeed.module.css";

const NotificationsFeed = () => {
  const { data: currentUser, mutate: mutateCurrentUser } = useCurrentUser();
  const { data: fetchedNotifications = [] } = useNotifications(currentUser?.id);

  useEffect(() => {
    mutateCurrentUser();
  }, [mutateCurrentUser]);

  if (fetchedNotifications.length === 0) {
    return <div className={styles.noNotifications}>No notifications</div>;
  }

  return (
    <div className={styles.notificationContainer}>
      {fetchedNotifications.map((notification) => (
        <div key={notification.id} className={styles.notificationItem}>
          <BsTwitter color="white" size={32} />
          <p className={styles.notificationText}>{notification.body}</p>
        </div>
      ))}
    </div>
  );
};

export default NotificationsFeed;
