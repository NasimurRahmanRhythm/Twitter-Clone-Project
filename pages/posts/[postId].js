import Form from "@/src/components/Form/Form";
import Header from "@/src/components/Header/Header";
import CommentFeed from "@/src/components/posts/CommentFeed/CommentFeed";
import PostItem from "@/src/components/posts/PostItem/PostItem";
import usePost from "@/src/hooks/usePost";
import { useRouter } from "next/router";
import React from "react";
import { ClipLoader } from "react-spinners";

const PostView = () => {
  const router = useRouter();
  const { postId } = router.query;
  const { data: fetchedPost, isLoading } = usePost(postId);
  if (isLoading || !fetchedPost) {
    return (
      <div className="flex justify-center items-center h-full">
        <ClipLoader color="light-blue" size={80} />
      </div>
    );
  }

  return (
    <>
      <Header label="Tweet" showBackArrow />
      <PostItem data={fetchedPost} />
      <Form postId={postId} isComment placeholder="Tweet your reply" />
      <CommentFeed comments={fetchedPost?.comments} />
    </>
  );
};

export default PostView;
