import { useRouter } from 'next/router';
import React, { useCallback } from 'react';
import { BiArrowBack } from 'react-icons/bi';

import styles from './Header.module.css';

const Header = ({ label, showBackArrow }) => {
  const router = useRouter();
  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

  return (
    <div className={styles.headerContainer}>
      <div className={styles.headerContent}>
        {showBackArrow && (
          <BiArrowBack
            onClick={handleBack}
            color="white"
            size={20}
            className={styles.backArrow}
          />
        )}
        <h1 className={styles.headerTitle}>{label}</h1>
      </div>
    </div>
  );
};

export default Header;
