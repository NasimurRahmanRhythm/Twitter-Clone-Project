import React from 'react';
import { BsHouseFill, BsBellFill } from 'react-icons/bs';
import { signOut } from 'next-auth/react';
import { FaUser } from 'react-icons/fa';
import { BiLogOut } from 'react-icons/bi';
import styles from './Sidebar.module.css';
import SidebarLogo from '../SidebarLogo/SidebarLogo';
import SidebarItem from '../SidebarItem/SidebarItem';
import SidebarTweetButton from '../SidebarTweetButton/SidebarTweetButton';
import useCurrentUser from '@/src/hooks/useCurrentUser';

const Sidebar = () => {
  const { data: currentUser } = useCurrentUser();
  const items = [
    {
      label: 'Home',
      href: '/',
      icon: BsHouseFill,
    },
    {
      label: 'Notifications',
      href: '/notifications',
      icon: BsBellFill,
      auth: true,
      alert: currentUser?.hasNotification,
    },
    {
      label: 'Profile',
      href: `/users/${currentUser?.id}`,
      icon: FaUser,
      auth: true,
    },
  ];

  return (
    <div className={styles.sidebar}>
      <div className={styles.sidebarContent}>
        <div className={styles.sidebarItems}>
          <SidebarLogo />
          {items.map((item) => (
            <SidebarItem
              key={item.href}
              alert={item.alert}
              auth={item.auth}
              href={item.href}
              icon={item.icon}
              label={item.label}
            />
          ))}
          {currentUser && (
            <SidebarItem onClick={() => signOut()} icon={BiLogOut} label="Logout" />
          )}
          <SidebarTweetButton />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
