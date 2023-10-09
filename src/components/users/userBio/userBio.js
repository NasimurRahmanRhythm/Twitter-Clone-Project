import { useCallback, useMemo, useState } from "react";
import { BiCalendar } from "react-icons/bi";
import { format } from "date-fns";

import useUser from "@/src/hooks/useUser";
import useFollow from "@/src/hooks/useFollow";
import useEditModal from "@/src/hooks/useEditModal";
import Button from "../../Button/Button";
import styles from "./userBio.module.css";
import { useSession } from "next-auth/react";
import axios from "axios";

const UserBio = ({ userId }) => {
  const { data: currentUser } = useSession();
  const { data: fetchedUser } = useUser(userId);

  const editModal = useEditModal();

  const { isFollowing, toggleFollow } = useFollow(userId);
  const [showFollowing, setShowFollowing] = useState(false);
  const [followingData, setFollowingData] = useState(null);
  const [showFollower, setShowFollower] = useState(false);
  const [followerData, setFollowerData] = useState(null);

  const Follower = useCallback(
    async (ev) => {
      ev.stopPropagation();
      if (showFollowing) {
        setShowFollowing(false);
        setShowFollower(true);
      } else {
        setShowFollower(!showFollower);
      }
      try {
        const response = await axios.post("/api/followers", { userId });
        const responseData = response.data;
        setFollowerData(responseData);
        console.log(responseData);
      } catch (error) {
        console.log("Following names errors is", error);
      }
    },
    [showFollowing,showFollower,userId]
  );

  const Following = useCallback(
    async (ev) => {
      ev.stopPropagation();
      if (showFollower) {
        setShowFollower(false);
        setShowFollowing(true);
      } else {
        setShowFollowing(!showFollowing);
      }
      try {
        const response = await axios.post("/api/followings", { userId });
        const responseData = response.data;
        setFollowingData(responseData);
        console.log(responseData);
      } catch (error) {
        console.log("Following names errors is", error);
      }
    },
    [showFollowing,showFollower, userId]
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
            <p className={styles.followLabel}>Following</p>
          </div>
          <div className={styles.following} onClick={Follower}>
            <p className={styles.followCount}>
              {fetchedUser?.followerIds?.length}
            </p>
            <p className={styles.followLabel}>Followers</p>
          </div>
        </div>
        {showFollowing
          ? followingData?.map((user) => (
              <div className={styles.followLabel}>
                {user.username}
              </div>
            ))
          : null}

        {showFollower
          ? followerData?.map((user) => (
              <div className={styles.followLabel}>
                {user.username}
              </div>
            ))
          : null}
      </div>
    </div>
  );
};

export default UserBio;
