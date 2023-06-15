import { CgMore } from "react-icons/cg";
import styles from "./MiniProfile.module.css";
import { Avator } from "@/components/user/components/avatar/Avatar";
export function MiniProfile({ user, onClick, action }) {
  return (
    <div className={styles.profile} onClick={onClick}>
      <Avator src={user?.image} size="48" />
      <div className={styles.names}>
        <p className={styles.name}>{user?.name}</p>
        <p className={styles.username}>@{user?.username}</p>
      </div>
      <div className={styles.action}>{action}</div>
    </div>
  );
}
