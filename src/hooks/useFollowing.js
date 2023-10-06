import React, { useCallback, useState, useEffect } from 'react';
import useLoginModal from './useLoginModal';
import { useSession } from 'next-auth/react';
import axios from 'axios'; 

const useFollowing = ({ userId }) => {
  const loginModal = useLoginModal();
  const { data: currentUser } = useSession();
  const [followingData, setFollowingData] = useState(null);

  const fetchData = useCallback(async () => {
    if (!currentUser || !userId) {
      return;
    }

    try {
      const response = await axios.post('/api/followingnames', { userId });
      const responseData = response.data;
      setFollowingData(responseData);
      console.log(responseData);
    } catch (error) {
      console.log("Following names errors is", error);
    }
  }, [currentUser, userId]);

  useEffect(() => {
    fetchData();
  }, [fetchData, userId]);

  return {
    followingData,
    fetchData, 
  };
};

export default useFollowing;
