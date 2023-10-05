import { useCallback, useMemo } from "react";
import { BiCalendar } from "react-icons/bi";
import { format } from "date-fns";

import useCurrentUser from "@/src/hooks/useCurrentUser";
import useUser from "@/src/hooks/useUser";
import useFollow from "@/src/hooks/useFollow";
import useEditModal from "@/src/hooks/useEditModal";
import Button from "../../Button/Button";
import styles from "./userBio.module.css";
import { useSession } from "next-auth/react";
import useFollowerModal from "@/src/hooks/useFollowerModal";

const UserBio = ({ userId }) => {
  const { data: currentUser } = useSession();
  const { data: fetchedUser } = useUser(userId);

  const editModal = useEditModal();
  const followingModal = useFollowerModal();
  const followerModal = useFollowerModal();

  const { isFollowing, toggleFollow } = useFollow(userId);

  const Following = useCallback(
    (ev) => {
      ev.stopPropagation();
      followingModal.onOpen(userId);
    },
    [followingModal, userId]
  );

  const Follower = useCallback(
    (ev) => {
      ev.stopPropagation();
      followerModal.onOpen(userId);
    },
    [followerModal, userId]
  );
  

  const createdAt = useMemo(() => {
    if (!fetchedUser?.createdAt) {
      return null;
    }

    return format(new Date(fetchedUser.createdAt), "MMMM yyyy");
  }, [fetchedUser?.createdAt]);

  return (
    <div className={styles.bioContainer}>
      <div className={styles.buttonWrapper}>
        {currentUser?.user._id === userId ? (
          <Button secondary label="Edit" onClick={editModal.onOpen} />
        ) : (
          <Button
            onClick={toggleFollow}
            label={isFollowing ? "Unfollow" : "Follow"}
            secondary={!isFollowing}
            outline={isFollowing}
          />
        )}
      </div>
      <div className={styles.contentWrapper}>
        <div className={styles.nameUsername}>
          <p className={styles.name}>{fetchedUser?.name}</p>
          <p className={styles.username}>@{fetchedUser?.username}</p>
        </div>
        <div className={styles.bioJoined}>
          <div className={styles.joined}>
            <BiCalendar size={24} />
            <p>Joined {createdAt}</p>
          </div>
        </div>
        <div className={styles.followInfo}>
          <div className={styles.following} onClick={Following}>
            <p className={styles.followCount}>
              {fetchedUser?.followingIds?.length}
            </p>
            <p className={styles.followLabel} >Following</p>
          </div>
          <div className={styles.following} onClick={Follower}>
            <p className={styles.followCount}>
              {fetchedUser?.followerIds?.length}
            </p>
            <p className={styles.followLabel}>Followers</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserBio;
