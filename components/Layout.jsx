import React from 'react';
import Followbar from './layout/Followbar';
import Sidebar from './layout/Sidebar';

import styles from './Layout.module.css';

const Layout = ({ children }) => {
  return (
    <div className={styles.layout}>
      <div className={styles.container}>
        <div className={styles.grid}>
          <Sidebar />
          <div className={styles.mainContent}>{children}</div>
          <Followbar />
        </div>
      </div>
    </div>
  );
};

export default Layout;
