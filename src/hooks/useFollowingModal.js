// Modify useFollowingModal.js

import { create } from "zustand";
import useUser from '@/src/hooks/useUser';

const useFollowingModal = create((set) => ({
  isOpen: false,
  userId: null,
  followingUsernames: [], 
  onOpen: async (userId) => {
    set({ isOpen: true, userId });

    const { data: user } = await useUser(userId);
    if (user && user.followingIds) {
      const followingUsernames = await Promise.all(
        user.followingIds.map(async (id) => {
          const { data: followingUser } = await useUser(id);
          return followingUser.username;
        })
      );
      set({ followingUsernames });
    }
  },
  onClose: () => set({ isOpen: false, followingUsernames: [] }),
}));

export default useFollowingModal;
