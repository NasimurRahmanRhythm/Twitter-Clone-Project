import { useRouter } from "next/router";
import { ClipLoader } from "react-spinners";

import useUser from "@/src/hooks/useUser";

import Header from "@/src/components/Header/Header";
import UserBio from "@/src/components/users/userBio/userBio";
import UserHero from "@/src/components/users/UserHero/UserHero";
import PostFeed from "@/src/components/posts/PostFeed/PostFeed";

const UserView = () => {
  const router = useRouter();
  const { userId } = router.query;

  const { data: fetchedUser, isLoading } = useUser(userId);
  //console.log("UserId", userId);
  //console.log("Fetched Us", fetchedUser);
  if (isLoading || !fetchedUser) {
    return (
      <div className="flex justify-center items-center h-full">
        <ClipLoader color="lightblue" size={80} />
      </div>
    );
  }

  return (
    <>
      <Header showBackArrow label={fetchedUser?.name} />
      <UserHero userId={userId} />
      <UserBio userId={userId} />
      <PostFeed userId={userId} />
    </>
  );
};

export default UserView;
