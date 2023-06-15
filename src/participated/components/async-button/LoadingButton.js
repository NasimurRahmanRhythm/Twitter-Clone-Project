import { useCustomState } from "@/participated/hooks/useCustomState";
import styles from "./AsyncButton.module.css";
export function LoadingButton({
  onClick = () => {},
  children,
  className,
  loading = false,
}) {
  const loading = useCustomState(false);
  return (
    <button onClick={onClick} className={`${className} ${styles.button}`}>
      <div className={loading ? styles.hide : styles.show}>{children}</div>
      <div
        className={`${loading ? styles.show : styles.hide} ${styles.loading}`}
      >
        <div className="loader"></div>
      </div>
    </button>
  );
}
