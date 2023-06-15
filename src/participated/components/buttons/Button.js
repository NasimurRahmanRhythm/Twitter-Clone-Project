import styles from './buttons.module.css'
export function Button({children,className,style}){
  return (<button className={`${styles.button} ${className}`} style={style}>
    {children} 
  </button>)
}
