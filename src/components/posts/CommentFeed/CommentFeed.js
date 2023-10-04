import React from "react";
import PostItem from "../PostItem/PostItem";

const CommentFeed = ({ comments }) => {
  return (
    <div>
      {comments.map((comment) => (
        <PostItem data={comment} />
      ))}
    </div>
  );
};

export default CommentFeed;