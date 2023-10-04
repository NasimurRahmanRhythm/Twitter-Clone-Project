import usePosts from '@/src/hooks/usePosts'; 
import React from 'react'
import PostItem from '../PostItem/PostItem';
import { useSession } from 'next-auth/react';

const PostFeed = ({userId}) => {
    const {data: posts = [] } = usePosts(userId);
    console.log("Post feed userId is", userId);
    const { data: session, status, update } = useSession();
    //console.log("Session is ", session);
    //console.log("Session id is ", session?.user._id);
    const filteredPosts = posts.filter((post) => post.type === 'post');
  return (
    <>
        {filteredPosts.map((post) =>(
            <PostItem
            userId = {userId}
            key= {post._id}
            data= {post}
            />
        ))}
    </>
  )
}

export default PostFeed;
