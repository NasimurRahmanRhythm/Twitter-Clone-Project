import { useRouter } from 'next/router';
import React from 'react';
import { BsTwitter } from 'react-icons/bs';
import styles from './SidebarLogo.module.css';

const SidebarLogo = () => {
  const router = useRouter();
  return (
    <div
      onClick={() => router.push('/')}
      className={styles.sidebarLogo}
    >
      <BsTwitter size={28} color="white" />
    </div>
  );
};

export default SidebarLogo;
