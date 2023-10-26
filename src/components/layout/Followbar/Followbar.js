import useUsers from "@/hooks/useUsers";
import styles from "./followbar.module.css";
import Avatar from "../../Avatar/Avatar";

const FollowBar = () => {
  const { data: users = [] } = useUsers();

  if (users.length === 0) {
    return null;
  }
  //console.log("User", users);

  return (
    <div className={styles.container}>
      <div className={styles.followBar}>
        <h2 className={styles.title}>Who to follow</h2>
        <div className={styles.userList}>
          {users.filter((user)=> user.isVerified === true). 
          map((user) => (
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
    </div>
  );
};

export default FollowBar;
