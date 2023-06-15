import { MiniProfile } from "@/participated/components/mini-profile/MiniProfile";
import styles from "./MiniUserList.module.css";
export function MiniUserList({
  title = "",
  users = [],
  onItemClick = (_user) => {},
}) {
  return (
    <div className={styles.miniUserList}>
      <div>{title}</div>
      <div className="h-divider"></div>
      {users.map((user) => (
        <div key={user.id} className={styles.user}>
          <MiniProfile user={user} onClick={() => onItemClick(user)} />
        </div>
      ))}
    </div>
  );
}
