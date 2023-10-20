import { useSession } from 'next-auth/react';
import React from 'react'
import styles from './NewMessage.module.css';


const NewMessage = ({message}) => {
    const {data: currentUser} = useSession();
  return (
    <div>
        <div className={currentUser?.user._id === message.sender ? styles.myMsg : styles.otherMsg}>
          <div className= {`${styles.msg}`}>{message?.content?.text}</div>
          <div className={`${styles.label}`}>{message.seen? 'seen' : 'sent'}</div>
        </div>
    </div>
  )
}

export default NewMessage;