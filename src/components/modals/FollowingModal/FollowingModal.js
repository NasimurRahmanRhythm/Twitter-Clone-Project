// Modify FollowingModal.js

import useFollowingModal from "@/src/hooks/useFollowingModal";
import React from "react";

const FollowingModal = () => {
  const { isOpen, followingUsernames, onClose } = useFollowingModal();
  console.log("Following modal is", isOpen,followingUsernames,onClose);

  return (
    <div>
      {isOpen ? (
        <div>
          <h1>FollowingModal</h1>
          <ul>
            {followingUsernames.map((username) => (
              <li key={username}>{username}</li>
            ))}
          </ul>
          <button onClick={onClose}>Close</button>
        </div>
      ) : null}
    </div>
  );
};

export default FollowingModal;
