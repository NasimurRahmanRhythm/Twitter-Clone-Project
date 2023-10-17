import React from 'react';
import { useRouter } from 'next/router';
import styles from './Layout.module.css';
import FollowBar from './layout/Followbar/Followbar';
import Sidebar from './layout/Sidebar/Sidebar';

const Layout = ({ children }) => {
  const router = useRouter();

  return (
    <div className={styles.layout}>
      <div className={styles.container}>
      <div className={router.pathname !== '/message' ? styles.grid : styles.gridMessage}>
          <Sidebar />
          <div className={styles.mainContent}>{children}</div>
          {router.pathname !== '/message' && <FollowBar />}
        </div>
      </div>
    </div>
  );
};

export default Layout;
