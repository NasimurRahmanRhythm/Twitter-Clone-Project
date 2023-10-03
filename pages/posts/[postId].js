import Form from "@/src/components/Form/Form";
import Header from "@/src/components/Header/Header";
import CommentFeed from "@/src/components/posts/CommentFeed/CommentFeed";
import PostItem from "@/src/components/posts/PostItem/PostItem";
import usePost from "@/src/hooks/usePost";
import usePostIds from "@/src/hooks/usePostIds";
import fetcher from "@/src/libs/fetcher";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { ClipLoader } from "react-spinners";

import useSWR from 'swr'; // Import useSWR here

const PostView = () => {
  const router = useRouter();
  const { postId } = router.query;
  const { data: fetchedPost, isLoading } = usePost(postId);
  const [commentData, setCommentData] = useState([]);
  const [commentsLoading, setCommentsLoading] = useState(false);

  useEffect(() => {
    if (fetchedPost && fetchedPost.comments) {
      setCommentsLoading(true);
      const commentUrls = fetchedPost.comments.map(
        (postId) => (postId ? `/api/posts/${postId}` : null)
      );

      const fetchData = async () => {
        try {
          const resultData = await Promise.all(
            commentUrls.map((url) => fetch(url).then((res) => res.json()))
          );
          setCommentData(resultData);
          setCommentsLoading(false);
        } catch (error) {
          console.error("Error fetching comments:", error);
          setCommentsLoading(false);
        }
      };

      fetchData();
    }
  }, [fetchedPost]);


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
      {commentsLoading ? (
        <div className="flex justify-center items-center h-full">
          <ClipLoader color="light-blue" size={80} />
        </div>
      ) : (
        <CommentFeed comments={commentData} />
      )}
      <Form postId={postId} isComment placeholder="Tweet your reply" />
    </>
  );
};

export default PostView;
