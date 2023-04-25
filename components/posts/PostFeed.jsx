import usePosts from '@/hooks/usePosts'
import React from 'react'
import PostItem from './PostItem';

const PostFeed = ({userId}) => {
    const {data: posts = [] } = usePosts(userId);
  return (
    <>
        {posts.map((post) =>(
            <PostItem
            userId = {userId}
            key= {post.id}
            data= {post}
            />
        ))}
    </>
  )
}

export default PostFeed
