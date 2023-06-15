import styles from './Appbar.module.css'
export function Appbar({className,title}){
  return <div className={styles.appbar+" "+"glass"}>
    <h2>{title}</h2>
  </div> 
}
