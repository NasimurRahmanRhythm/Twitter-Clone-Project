import { useCallback, useMemo, useState } from "react";
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
import { useRouter } from "next/router";
import useFollowing from "@/src/hooks/useFollowing";
import List from "../../List";
import axios from "axios";

const UserBio = ({ userId }) => {
  const { data: currentUser } = useSession();
  const { data: fetchedUser } = useUser(userId);

  const editModal = useEditModal();
  const { fetchData }=useFollowing({ userId: userId });
  const followerModal = useFollowerModal();
  const router = useRouter();

  const { isFollowing, toggleFollow } = useFollow(userId);
  const [showFollowing, setShowFollowing] = useState(false);
  const [followingData, setFollowingData] = useState(null);
  const [showFollower, setShowFollower] = useState(false);
  const [followerData, setFollowerData] = useState(null);

  const Follower = useCallback( async (ev) => {
    ev.stopPropagation();
    if(showFollowing){
      setShowFollowing(false);
    }
    setShowFollower(!showFollower);
    try {
      const response = await axios.post('/api/followernames', { userId });
      const responseData = response.data;
      setFollowerData(responseData);
      console.log(responseData);
    } catch (error) {
      console.log("Following names errors is", error);
    }

  },
  [showFollowing, userId]
);

  const Following = useCallback( async (ev) => {
      ev.stopPropagation();
      if(showFollower){
        setShowFollower(false);
      }
      setShowFollowing(!showFollowing);
      try {
        const response = await axios.post('/api/followingnames', { userId });
        const responseData = response.data;
        setFollowingData(responseData);
        console.log(responseData);
      } catch (error) {
        console.log("Following names errors is", error);
      }

    },
    [showFollowing, userId]
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
        {
          showFollowing ? (
            followingData?.map((username) => (
              <div className={styles.followLabel} key={username}>{username}</div>
            ))
          ) : null
        }

        {
          showFollower ? (
            followerData?.map((username) => (
              <div className={styles.followLabel} key={username}>{username}</div>
            ))
          ) : null
        }
      </div>
    </div>
  );
};

export default UserBio;
