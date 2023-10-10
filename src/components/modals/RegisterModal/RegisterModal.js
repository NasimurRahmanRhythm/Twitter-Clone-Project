import axios from 'axios';
import React, { useCallback, useState } from 'react';
import { toast } from 'react-hot-toast';
import { signIn } from 'next-auth/react';
import styles from './RegisterModal.module.css';
import useLoginModal from '@/src/hooks/useLoginModal';
import useRegisterModal from '@/src/hooks/useRegisterModal';
import Input from '../../Input/Input';
import Modal from '../../Modal/Modal';
import { useRouter } from 'next/router';

const RegisterModal = () => {
  const loginModal = useLoginModal();
  const registerModal = useRegisterModal();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const onToggle = useCallback(() => {
    if (isLoading) {
      return;
    }

    registerModal.onClose();
    loginModal.onOpen();
  }, [loginModal, registerModal, isLoading]);

  const onSubmit = useCallback(async () => {
    try {
      // router = useRouter();
      setIsLoading(true);

      await axios.post('/api/register', {
        email,
        password,
        username,
        name,
      });

      toast.success('Verification link sent');
      router.push('/');
      registerModal.onClose();
    } catch (error) {
      console.log(error);
      toast.error('Something wrong');
    } finally {
      setIsLoading(false);
    }
  }, [registerModal, email, password, username, name]);
  
  const gitSignIn = useCallback(async () => {
    try {
      setIsLoading(true);
      await signIn("github")
      loginModal.onClose();
    }catch(error) {
      console.log("Github Error is ", error);
    }finally {
      setIsLoading(false);
    }
  }, [loginModal]);
  const bodyContent = (
    <div className={styles.content}>
      <Input
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
        value={email}
        disabled={isLoading}
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
        placeholder="Password"
        type="password"
        onChange={(e) => setPassword(e.target.value)}
        value={password}
        disabled={isLoading}
      />
    </div>
  );

  const footerContent = (
    <div className={styles.footer}>
      <p>
        Want to Sign in with Github?
        <span onClick={gitSignIn} className={styles.signInLink}>
          {' '}
          Click here
        </span>
      </p>
      <p>
        Already have an account?
        <span onClick={onToggle} className={styles.signInLink}>
          {' '}
          Sign in
        </span>
      </p>
    </div>
  );

  return (
    <Modal
      disabled={isLoading}
      isOpen={registerModal.isOpen}
      title="Create an Account"
      actionLabel="Register"
      onClose={registerModal.onClose}
      onSubmit={onSubmit}
      body={bodyContent}
      footer={footerContent}
    />
  );
};

export default RegisterModal;
