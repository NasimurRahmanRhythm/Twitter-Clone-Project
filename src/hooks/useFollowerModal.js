import { create } from "zustand";
import axios from "axios";

const useFollowerModal = create((set) => ({
  isOpen: false,
  userId: null,
  followerUsernames: [],
  onOpen: (userId) => {
    set({ isOpen: true, userId });
    if (userId) {
      axios.post("/api/followernames", { userId })
        .then((response) => {
          set({ followerUsernames: response.data });
        })
        .catch((error) => {
          console.error("Follower ids errors are ",error);
        });
    }
  },
  onClose: () => set({ isOpen: false }),
}));

export default useFollowerModal;
