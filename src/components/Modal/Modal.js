import React, { useCallback } from 'react'
import { AiOutlineClose } from "react-icons/ai";
import styles from './Modal.module.css';
import Button from '../Button/Button';


const Modal = ({ isOpen, onClose, onSubmit, title, body, actionLabel, footer, disabled }) => {
    const handleClose = useCallback(() => {
        if (disabled) {
          return;
        }
      
        onClose();
      }, [onClose, disabled]);

      const handleSubmit = useCallback(() => {
        if (disabled) {
          return;
        }
    
        onSubmit();
      }, [onSubmit, disabled]);

    if (!isOpen) {
       return null;
    }
    return (
      <>
        <div className={styles.modalOverlay}>
          <div className={styles.modalContainer}>
            {/*content*/}
            <div className={styles.modalContent}>
              {/*header*/}
              <div className={styles.modalHeader}>
                <h3 className={styles.modalTitle}>{title}</h3>
                <button className={styles.closeButton} onClick={handleClose}>
                  <AiOutlineClose size={20} />
                </button>
              </div>
              {/*body*/}
              <div className={styles.modalBody}>{body}</div>
              {/*footer*/}
              <div className={styles.modalFooter}>
                <Button
                  disabled={disabled}
                  label={actionLabel}
                  secondary
                  fullWidth
                  large
                  onClick={handleSubmit}
                />
                {footer}
              </div>
            </div>
          </div>
        </div>
      </>
    );
    
}

export default Modal
