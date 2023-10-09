import { useRouter } from 'next/router';
import React, { useCallback } from 'react';
import { BsDot } from 'react-icons/bs';
import styles from './SidebarItem.module.css';
import useLoginModal from '@/src/hooks/useLoginModal';
import { useSession } from 'next-auth/react';

const SidebarItem = ({ label, href, icon: IconComponent, onClick, auth, alert }) => {
  const { data: currentUser } = useSession();
  const loginModal = useLoginModal();
  const router = useRouter();
  const handleClick = useCallback(() => {
    if (onClick) {
      return onClick();
    }
    if (auth && !currentUser) {
      loginModal.onOpen();
    } else if (href) {
      router.push(href);
    }
  }, [router, onClick, href, currentUser, auth, loginModal]);

  return (
    <div onClick={handleClick} className={styles.sidebarItem}>
      <div className={`${styles.iconContainer} ${styles.iconContainerSmall}`}>
        <IconComponent size={28} color="white" />
        {alert ? <BsDot className={styles.alertDot} size={70} /> : null}
      </div>
      <div className={`${styles.iconContainer} ${styles.iconContainerLarge}`}>
        <IconComponent size={24} color="white" />
        <p className={styles.itemLabel}>{label}</p>
        {alert ? <BsDot className={styles.alertDot} size={70} /> : null}
      </div>
    </div>
  );
};

export default SidebarItem;
