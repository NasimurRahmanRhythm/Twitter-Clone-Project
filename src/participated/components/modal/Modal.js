import { useContext, useEffect } from "react";
import { LoadingBar } from "../loading-bar/LoadingBar";
import styles from "./Modal.module.css";
import { RxCross1 } from "react-icons/rx";
import { useModal } from "@/participated/hooks/useModal";
export function Modal({ children, onClose, loading }) {
  const modal = useModal();
  if (!onClose) {
    onClose = () => modal.close();
  }

  return (
    <div className={styles.modalBg}>
      <div className={styles.modal}>
        <div
          className="btn btn-icon"
          onClick={() => {
            onClose();
          }}
        >
          <RxCross1 />
        </div>
        {loading && <LoadingBar loading={loading} />}
        {children}
      </div>
    </div>
  );
}
