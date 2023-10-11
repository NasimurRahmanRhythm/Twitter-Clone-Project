import useLoginModal from "@/src/hooks/useLoginModal";
import useRegisterModal from "@/src/hooks/useRegisterModal";
import React, { useCallback, useState } from "react";
import { signIn } from "next-auth/react";
import styles from "./LoginModal.module.css";
import Input from "../../Input/Input";
import Modal from "../../Modal/Modal";

const LoginModal = () => {
  const loginModal = useLoginModal();
  const registerModal = useRegisterModal();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const onToggle = useCallback(() => {
    if (isLoading) {
      return;
    }

    registerModal.onOpen();
    loginModal.onClose();
  }, [loginModal, registerModal, isLoading]);

  const onSubmit = useCallback(async () => {
    try {
      setIsLoading(true);

      await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      loginModal.onClose();
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }, [loginModal, email, password]);

  const gitSignIn = async () => {
    const user = await signIn('github', {callbackUrl: 'http://localhost:3000/', redirect: true});
    //console.log("Github user is ",user);
  }

  const bodyContent = (
    <div className={styles.content}>
      <Input
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
        value={email}
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
        <span onClick={gitSignIn} className={styles.createAccountLink}>
          {' '}
          Click here
        </span>
      </p>
      <p>
        First time using Twitter?
        <span onClick={onToggle} className={styles.createAccountLink}>
          {" "}
          Create an account
        </span>
      </p>
    </div>
  );

  return (
    <Modal
      disabled={isLoading}
      isOpen={loginModal.isOpen}
      title="Login"
      actionLabel="Sign in"
      onClose={loginModal.onClose}
      onSubmit={onSubmit}
      body={bodyContent}
      footer={footerContent}
    />
  );
};

export default LoginModal;
