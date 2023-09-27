import { create } from "zustand";

const useEditModal = create((set) => ({
  isOpen: false,
  postId: null, 
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
  // setPostId: (postId) => set({ postId }), 
}));

export default useEditModal;
