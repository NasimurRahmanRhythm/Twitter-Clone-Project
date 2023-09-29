import { create } from "zustand";

const useEditModal = create((set) => ({
  isOpen: false,
  postId: null, 
  onOpen: (postId) => set({ isOpen: true, postId }),
    onClose: () => set({ isOpen: false }),
  // setPostId: (postId) => set({ postId }), 
}));

export default useEditModal;
