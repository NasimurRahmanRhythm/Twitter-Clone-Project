import React from "react";
import CommentItem from "../CommentItem/CommentItem";
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