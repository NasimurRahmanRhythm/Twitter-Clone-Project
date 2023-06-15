import Link from "next/link";
import styles from "./AuthBottomBar.module.css"
export function AuthBottomBar(){
  return (<div className={styles.authBottomBar}>
    <div className={styles.left}></div>
    <div className={styles.center}>
      <p className={styles.title}>Don’t miss what’s happening</p>
      <p className={styles.subtitle}>People on Twitter are the first to know.</p>
    </div>
    <div className={styles.right}>
      <Link href="?page=login" className={styles.login}
      >Log in</Link>
      <Link href="?page=signup" className={styles.signup}>Sign up</Link>
    </div>
  </div>)
}
