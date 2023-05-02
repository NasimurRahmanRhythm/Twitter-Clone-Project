import { useRouter } from 'next/router';
import React, { useCallback } from 'react';
import { FaFeather } from 'react-icons/fa';
import styles from './SidebarTweetButton.module.css';
import useLoginModal from '@/src/hooks/useLoginModal';

const SidebarTweetButton = () => {
  const router = useRouter();
  const loginModal = useLoginModal();
  const onClick = useCallback(() => {
    loginModal.onOpen();
  }, [loginModal]);

  return (
    <div onClick={onClick}>
      <div className={`${styles.tweetButton} ${styles.tweetButtonSmall}`}>
        <FaFeather size={24} color="white" />
      </div>
      <div className={`${styles.tweetButton} ${styles.tweetButtonLarge}`}>
        <p className={styles.tweetButtonText}>Tweet</p>
      </div>
    </div>
  );
};

export default SidebarTweetButton;
