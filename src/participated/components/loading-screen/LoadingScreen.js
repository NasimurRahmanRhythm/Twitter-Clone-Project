import { Spinner } from "../spinner/Spinner";
import styles from './LoadingScreen.module.css'
export function LoadingScreen(){
  return <div className={styles.screen}>
    <Spinner/>
  </div>
}
