import Form from "@/components/Form/Form";
import Header from "@/components/Header/Header";
import PostItem from "@/components/posts/PostItem/PostItem";
import usePost from "@/hooks/usePost";
import { useRouter } from "next/router";
import React from "react";
import { ClipLoader } from "react-spinners";


const PostView = () => {
  const router = useRouter();
  const { postId } = router.query;
  const { data: posts, isLoading } = usePost(postId);

  if (isLoading || !posts) {
    return (
      <div className="flex justify-center items-center h-full">
        <ClipLoader color="light-blue" size={80} />
      </div>
    );
  }

  return (
    <>
      <Header label="Tweet" showBackArrow />
      <PostItem data={posts} />
        {
          posts.comments.map((comment) => (
            <PostItem data={comment} />
          ))
        }
      <Form postId={postId} isComment placeholder="Tweet your reply" />
    </>
  );
};

export default PostView;
