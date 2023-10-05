import { create } from "zustand";

const useFollowerModal = create((set) => ({
  isOpen: false,
  userId: null, 
  onOpen: (userId) => set({ isOpen: true, userId }),
    onClose: () => set({ isOpen: false }),
}));

export default useFollowerModal;
