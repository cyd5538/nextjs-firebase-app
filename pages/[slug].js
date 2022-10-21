import React from 'react'
import { useRouter } from 'next/router';
import PostItem from '../components/post/PostItem';

const PostDetails = () => {
  const router = useRouter();
  const routeData = router.query;
  console.log(routeData);
  return (
    <div>
      <PostItem {...routeData}></PostItem>
    </div>
  )
}

export default PostDetails