import React from 'react'
import styles from './MessageBar.module.css'


const MessageBar = () => {
  return (
    <div className={styles.center}>
      <div  className={styles.message}>
        <h1>Select someone to send a Message</h1>
        </div>
    </div>
  )
}

export default MessageBar;