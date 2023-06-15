import { FaRegUser } from "react-icons/fa";
import { CgMore, CgMoreO } from "react-icons/cg";
import styles from "./Navbar.module.css";
import { RiHashtag, RiMessage2Line } from "react-icons/ri";
import { GrInbox, GrLogout, GrNotification } from "react-icons/gr";
import {
  BiHomeCircle,
  BiMessageSquare,
  BiMessageSquareDetail,
} from "react-icons/bi";
import Link from "next/link";
import TwitterLogo from "public/Twitter-logo.png";
import Image from "next/image";
import { Avator } from "@/components/user/components/avatar/Avatar";
import { CreateTweet } from "@/components/tweet/components/create-tweet/CreateTweet";
import { signOut, useSession } from "next-auth/react";
import { useModal } from "@/participated/hooks/useModal";
import { Confirmation } from "../confirmation/Confirmation";
import { useMessages } from "@/components/conversation/hooks/useMessages";

const authenticatedOptions = [
  {
    title: "Home",
    route: (...params) => "/home",
    icon: BiHomeCircle,
  },
  {
    title: "Explore",
    route: (...params) => "/home",
    icon: RiHashtag,
  },

  {
    title: "Notifications",
    route: (...params) => "/home",
    icon: GrNotification,
  },

  {
    title: "Messages",
    route: (...params) => "/message",
    icon: RiMessage2Line,
  },

  {
    title: "Profile",
    route: (...params) => "/profile/" + params[0],
    icon: FaRegUser,
  },

  {
    title: "More",
    route: (...params) => "/",
    icon: CgMoreO,
  },
];

const unAuthenticatedOptions = [
  {
    title: "Explore",
    route: (...params) => "/",
    icon: RiHashtag,
  },
];

export function Navbar({ onNewTweet }) {
  const { data: session, status } = useSession();
  const options =
    status === "authenticated" ? authenticatedOptions : unAuthenticatedOptions;
  console.log(status);
  const modal = useModal();
  const { messageNotifications } = useMessages();

  const showCreateTweet = () => {
    modal.open(
      <CreateTweet
        expanded
        onComplete={(newTweet) => {
          onNewTweet(newTweet);
          modal.close();
        }}
      />
    );
  };
  return (
    <>
      <nav className={styles.navbar}>
        <ul className={styles.navList}>
          <li className={styles.logoItem}>
            <Image alt="jhi" src={TwitterLogo} className={styles.logo} />
          </li>

          {options.map((v, i) => (
            <li key={i}>
              <Link
                href={v.route(session?.user?.id)}
                className={styles.navOptions}
              >
                <div className={styles.navItem} style={{ fontWeight: "500" }}>
                  <div style={{ position: "relative" }}>
                    {<v.icon className={styles.navIcon} />}
                    {v.title === "Messages" &&
                      messageNotifications.size !== 0 && (
                        <span className="notification-badge"></span>
                      )}
                  </div>
                  <span className={styles.navText}>{v.title}</span>
                </div>
              </Link>
            </li>
          ))}

          {status === "authenticated" && (
            <>
              <li>
                <button
                  className={`btn btn-bordered brn-ghost ${styles.navOptions}`}
                  style={{ marginBottom: "8px" }}
                  onClick={() =>
                    modal.open(
                      <Confirmation
                        subtitle={"You want to log out"}
                        onConfirm={async () => {
                          modal.startLoading();
                          await signOut();
                          modal.close();
                        }}
                      />
                    )
                  }
                >
                  <GrLogout /> <span className={styles.navText}>Sign out</span>
                </button>
              </li>
              <li>
                <button
                  className={styles.tweetButton}
                  onClick={showCreateTweet}
                >
                  Tweet
                </button>
              </li>
              <li className={styles.profile}>
                <Avator alt="avatar" src={session.user.image} size="48" />
                <div>
                  <p className={styles.name}>{session.user.name}</p>
                  <p className={styles.username}>@{session.user.username}</p>
                </div>
                <CgMore />
              </li>
            </>
          )}
        </ul>
      </nav>
    </>
  );
}
