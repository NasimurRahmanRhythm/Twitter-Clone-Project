import styles from './buttons.module.css'
export function IconButton({icon,className,color,text}){
  return (
  <div className={styles.iconButton}>
      <div className=''>
       <icon className={className+" "+styles.iconButton}/>
       <div className={styles.iconBg}></div>
      </div>
      {text}
    </div>
  )
}
