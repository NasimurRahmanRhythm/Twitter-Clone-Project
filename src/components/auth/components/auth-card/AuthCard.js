import Link from "next/link";
import styles from "./AuthCard.module.css";
import { BsGithub } from "react-icons/bs";
import { signIn } from "next-auth/react";
export function AuthCard() {
  const signUpWithGithub =async ()=>{
    const user = await signIn('github',{callbackUrl:'/home'})
    console.log(user)
  }
  return (
    <div className={styles.authCard}>
      <div className={styles.title}>New to Twitter</div>
      <div className={styles.subtitle}>
        <span>Sign up now to get your own personalized timeline!</span>
      </div>
      <button onClick={signUpWithGithub} className={'btn btn-ghost ' + styles.btnGithub}>
        <BsGithub />
        Sign up with Github
      </button>
        <Link className={'btn btn-ghost ' + styles.btnEmail} href='?page=create-account'> 
        Create Account
        </Link>
      <p className={styles.subtitle}>
        By signing up, you agree to the <span className="text-primary">Terms of Service </span> and <span className="text-primary"> Privacy Policy</span>,
        including <span className="text-primary"> Cookie Use</span>.
      </p>
    </div>
  );
}
