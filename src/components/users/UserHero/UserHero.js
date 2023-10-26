import Image from "next/image";

import useUser from "@/hooks/useUser";

import Avatar from "../../Avatar/Avatar";
import styles from "./UserHero.module.css";

const UserHero = ({ userId }) => {
  const { data: fetchedUser } = useUser(userId);

  return (
    <div>
      <div className={styles.heroBackground}>
        {fetchedUser?.coverImage && (
          <Image
            src={fetchedUser.coverImage}
            fill
            alt="Cover Image"
            style={{ objectFit: "cover" }}
          />
        )}
        <div className={styles.avatarWrapper}>
          <Avatar userId={userId} isLarge hasBorder />
        </div>
      </div>
    </div>
  );
};

export default UserHero;
