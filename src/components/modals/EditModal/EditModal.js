import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import styles from './EditModal.module.css';
import useCurrentUser from '@/src/hooks/useCurrentUser';
import useEditModal from '@/src/hooks/useEditModal';
import useUser from '@/src/hooks/useUser';
import ImageUpload from '../../ImageUpload/ImageUpload';
import Input from '../../Input/Input';
import Modal from '../../Modal/Modal';

const EditModal = () => {
  const { data: currentUser } = useCurrentUser();
  const { mutate: mutateFetchedUser } = useUser(currentUser?._id);
  const editModal = useEditModal();
  const [profileImage, setProfileImage] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');

  useEffect(() => {
    setProfileImage(currentUser?.profileImage);
    setCoverImage(currentUser?.coverImage);
    setName(currentUser?.name);
    setUsername(currentUser?.username);
    setBio(currentUser?.bio);
  }, [currentUser]);

  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = useCallback(async () => {
    try {
      setIsLoading(true);
      await axios.patch('api/edit', {
        name,
        username,
        bio,
        profileImage,
        coverImage,
      });
      mutateFetchedUser();

      toast.success('Updated');
      editModal.onClose();
    } catch (error) {
      toast.error('Something is wrong');
    } finally {
      setIsLoading(false);
    }
  }, [bio, name, username, profileImage, coverImage, editModal, mutateFetchedUser]);

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
      <Input
        placeholder="Bio"
        onChange={(e) => setBio(e.target.value)}
        value={bio}
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
