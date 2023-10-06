import Header from "@/src/components/Header/Header";
import List from "@/src/components/List";
import useFollowing from "@/src/hooks/useFollowing";
import useUser from "@/src/hooks/useUser";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { ClipLoader } from "react-spinners";

const FollowingNames = () => {
  const router = useRouter();
  const { userId } = router.query;
  const { data: fetchedUser, isLoading } = useUser(userId);
  const { followingData, fetchData } = useFollowing(userId);
  

  if (isLoading || !fetchedUser) {
    return (
      <div className="flex justify-center items-center h-full">
        <ClipLoader color="lightblue" size={80} />
      </div>
    );
  }

  console.log("Following data is ",followingData);

  return (
    <>
      <Header showBackArrow label="Following Names" />
      {isDataLoaded ? (
        <List list={followingData} />
      ) : (
        <p>Loading following data...</p>
      )}
    </>
  );
};

export default FollowingNames;
