import Image from 'next/image';
import styles from './Content.module.css'
export function Content({ content, image }) {
  console.log(image)
  return (
    <div className={styles.content}>
      {content && <div className={styles.text}>{content}</div>}
      {image && image !== 'undefined' && (
        <div className={styles.image}>
          <img alt='a' src={image}/>
        </div>
      )}
    </div>
  );
}
