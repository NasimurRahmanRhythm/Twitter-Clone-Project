import React from "react";
import CommentItem from "../CommentItem/CommentItem";

const CommentFeed = ({ comments = [] }) => {
  return (
    <>
      {comments.map((comment) => (
        <CommentItem key={comment._id} data={comment} />
      ))}
    </>
  );
};

export default CommentFeed;
