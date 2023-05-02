import React from 'react';
import styles from './Layout.module.css';
import FollowBar from './layout/Followbar/Followbar';
import Sidebar from './layout/Sidebar/Sidebar';

const Layout = ({ children }) => {
  return (
    <div className={styles.layout}>
      <div className={styles.container}>
        <div className={styles.grid}>
          <Sidebar />
          <div className={styles.mainContent}>{children}</div>
          <FollowBar />
        </div>
      </div>
    </div>
  );
};

export default Layout;
