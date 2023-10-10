import React from "react";
import PostItem from "../PostItem/PostItem";
import Form from "../../Form/Form";

const CommentFeed = ({ comments }) => {
  return (
    <div>
      {comments.comments.map((comment) => (
        <PostItem data={comment} />
      ))}
      <div>
        <Form postId={comments._id} isComment placeholder="Tweet your reply" />
      </div>
    </div>
  );
};

export default CommentFeed;
