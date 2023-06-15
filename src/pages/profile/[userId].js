import { MainLayout } from "@/main/layout/mainLayout";
import { dbConnect } from "@/main/libs/db";
import { TweetView } from "@/components/tweet/components/tweet-view/TweetView";
import { ProfileLayout } from "@/components/user/components/profile-layout/ProfileLayout";
import { getProfile } from "@/components/user/services/server/get-profile.server";
import { MiniProfile } from "@/participated/components/mini-profile/MiniProfile";
import { useListState } from "@/participated/hooks/useListState";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { getServerSession } from "next-auth";
import { useRouter } from "next/router";
import { createOptions } from "../api/auth/[...nextauth]";

export async function getServerSideProps(ctx) {
  try {
    await dbConnect();
    const { userId } = ctx.params;
    console.log("this is a profile id ", userId);
    const { user } = await getServerSession(
      ctx.req,
      ctx.res,
      createOptions(ctx.req)
    );
    let profile;
    // if (page === "followers") {
    //   profile = await getProfileWithFollowers(userId);
    // } else if (page === "followings") {
    //   profile = await getProfileWithFollowings(userId);
    // } else {
    //   profile = await getProfileWithTweets(userId);
    // }
    profile = await getProfile(userId, user);
    console.log("adslk");

    return {
      props: JSON.parse(
        JSON.stringify({
          profile,
        })
      ),
    };
  } catch (err) {
    console.log(err);
    return {
      redirect: {
        destination: "/home",
      },
    };
  }
}

function Page({ profile }) {
  const tweets = useListState(profile.tweets);
  const followers = useListState(profile.followers);
  const followings = useListState(profile.followings);
  const [parent, _] = useAutoAnimate();
  const router = useRouter();
  const { page } = router.query;
  return (
    <MainLayout onNewTweet={tweets.add}>
      <ProfileLayout user={profile}>
        <div ref={parent}>
          {page === undefined &&
            tweets.value.map((tweet) => (
              <TweetView
                onDelete={tweets.remove}
                tweet={tweet}
                key={tweet.id}
              />
            ))}

          {page === "followers" &&
            followers.value.map((follower) => (
              <MiniProfile user={follower} key={follower.id} />
            ))}

          {page === "followings" &&
            followings.value.map((following) => (
              <MiniProfile user={following} key={following.id} />
            ))}
        </div>
      </ProfileLayout>
    </MainLayout>
  );
}

export default Page;
