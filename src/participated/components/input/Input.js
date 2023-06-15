import styles from './Input.module.css'
export function Input({placeHolder,style,className,register={},type,onChange}){
  return <div  className={styles.input+" "+className} style={style}>
    <input {...register}  placeholder=' ' type={type} onChange={onChange} />
    <label>{placeHolder}</label>
  </div>
}
