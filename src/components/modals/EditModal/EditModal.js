import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import styles from './EditModal.module.css';
import useEditModal from '@/src/hooks/useEditModal';
import useUser from '@/src/hooks/useUser';
import ImageUpload from '../../ImageUpload/ImageUpload';
import Input from '../../Input/Input';
import Modal from '../../Modal/Modal';
import { useSession } from 'next-auth/react';
import useCurrentUser from '@/src/hooks/useCurrentUser';

const EditModal = () => {
  const { data: currentUser } = useSession();
  console.log("My now user is ", + currentUser);
  const { mutate: mutateFetchedUser } = useUser(currentUser?._id);
  const {mutate: mutateCurrentUser} = useCurrentUser();
  const editModal = useEditModal();
  const [profileImage, setProfileImage] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  console.log("My currenttttt user in editmodal is + ", currentUser);
  useEffect(() => {
    setProfileImage(currentUser?.profileImage)
    setCoverImage(currentUser?.coverImage)
    setName(currentUser?.name)
    setUsername(currentUser?.username)
  }, [currentUser?.name, currentUser?.username, currentUser?.profileImage, currentUser?.coverImage]);
  
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = useCallback(async () => {
    try {
      setIsLoading(true);
      await axios.put(`/api/users/${currentUser._id}`, {
        name,
        username,
        profileImage,
        coverImage,
      });
      mutateCurrentUser();
      mutateFetchedUser();

      toast.success('Updated');
      editModal.onClose();
    } catch (error) {
      toast.error('Something in profile edit is wrong');
      console.log("Profile edit ", error);
    } finally {
      setIsLoading(false);
    }
  }, [ name, username, profileImage, coverImage, editModal, mutateFetchedUser, mutateCurrentUser]);

  const bodyContent = (
    <div className={styles.content}>
      <ImageUpload
        value={profileImage}
        disabled={isLoading}
        onChange={(image) => setProfileImage(image)}
        label="Upload Profile Image"
      />
      <ImageUpload
        value={coverImage}
        disabled={isLoading}
        onChange={(image) => setCoverImage(image)}
        label="Upload Cover Image"
      />
      <Input
        placeholder="Name"
        onChange={(e) => setName(e.target.value)}
        value={name}
        disabled={isLoading}
      />
      <Input
        placeholder="Username"
        onChange={(e) => setUsername(e.target.value)}
        value={username}
        disabled={isLoading}
      />
    </div>
  );

  return (
    <Modal
      disabled={isLoading}
      isOpen={editModal.isOpen}
      title="Edit your profile"
      actionLabel="Save"
      onClose={editModal.onClose}
      onSubmit={onSubmit}
      body={bodyContent}
    />
  );
};

export default EditModal;
