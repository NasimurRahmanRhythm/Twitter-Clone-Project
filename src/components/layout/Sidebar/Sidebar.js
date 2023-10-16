import React from 'react';
import { BsHouseFill, BsBellFill } from 'react-icons/bs';
import { signOut, useSession } from 'next-auth/react';
import { FaUser } from 'react-icons/fa';
import { BiLogOut } from 'react-icons/bi';
import styles from './Sidebar.module.css';
import SidebarLogo from '../SidebarLogo/SidebarLogo';
import SidebarItem from '../SidebarItem/SidebarItem';
import { AiOutlineMessage } from 'react-icons/ai';

const Sidebar = () => {
  const { data: currentUser } = useSession();
  //console.log("Current user is ffffff" + currentUser._id);
  const items = [
    {
      label: 'Home',
      href: '/',
      icon: BsHouseFill,
    },
    {
      label: 'Profile',
      href: `/users/${currentUser?.user._id}`,
      icon: FaUser,
      auth: true,
    },
    {
      label: 'Message',
      href: '/message',
      icon: AiOutlineMessage,
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
          {currentUser && <SidebarItem onClick={() => signOut()} icon={BiLogOut} label="Logout" />}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
