import { LoadingBar } from "@/participated/components/loading-bar/LoadingBar";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Avator } from "../avatar/Avatar";
import styles from "./ProfileLayout.module.css";
import { EditProfile } from "../edit-profile/EditProfile";
import { useModal } from "@/participated/hooks/useModal";
import { AsyncButton } from "@/participated/components/async-button/AsyncButton";
import { useActionDispatcher } from "@/participated/hooks/useAction";
import { UserActions } from "../../actions/user.action";
export function ProfileLayout({ user, children }) {
  const [userState, dispatch] = useActionDispatcher(user);
  const { data: session, status } = useSession();
  const modal = useModal();
  const router = useRouter();
  const { page } = router.query;

  return (
    <div>
      <div className="center-container">
        <div className="appbar">{userState?.name}</div>
        <div className="col">
          <div className={styles.cover}>
            <img src={userState?.cover} />
          </div>
          <div className={styles.profilePic}>
            <div>
              <Avator src={userState?.image} size="120" />
            </div>
            {status === "authenticated" &&
              (userState?.id === session.user.id ? (
                <button
                  onClick={() => {
                    modal.open(
                      <EditProfile user={userState} dispatch={dispatch} />
                    );
                  }}
                  className="btn btn-ghost btn-bordered"
                >
                  edit profile
                </button>
              ) : (
                <AsyncButton
                  className="btn btn-ghost btn-bordered"
                  onClickAsync={async () => {
                    await dispatch(UserActions.TOGGLE_FOLLOW);
                  }}
                >
                  {userState?.isFollowing ? "unfollow" : "follow"}
                </AsyncButton>
              ))}
          </div>
        </div>
        <div className={styles.info}>
          <div>{userState?.name}</div>
          <div>@{userState?.username}</div>
          <div>joined 21 december 2022</div>
          <div className="row" style={{ gap: "1rem" }}>
            <div>{userState?.totalFollowers | 0} followers</div>
            <div>{userState?.totalFollowings | 0} followings</div>
            <div></div>
          </div>
          <div className="tabbar" style={{ height: "3rem" }}>
            <Link
              scroll={false}
              href={`/profile/${user.id}/`}
              shallow
              className={`tab ${page === undefined ? "selected" : ""}`}
            >
              Tweets
            </Link>
            <Link
              scroll={false}
              href={`/profile/${user.id}/?page=followers`}
              shallow
              className={`tab ${page === "followers" ? "selected" : ""}`}
            >
              Followers
            </Link>
            <Link
              scroll={false}
              href={`/profile/${user.id}/?page=followings`}
              shallow
              className={`tab ${page === "followings" ? "selected" : ""}`}
            >
              Followings
            </Link>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}
