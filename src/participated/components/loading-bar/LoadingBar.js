import styles from "./LoadingBar.module.css";
export function LoadingBar({ loading, indeterminate }) {
  return indeterminate ? (
    <div className={ loading.started ? styles.indeterminate : ''}></div>
  ) : (
    <div
      className={
        loading.started
          ? `${styles.loadingBar} ${
              loading.completed ? styles.completed : styles.loading
            }`
          : ""
      }
    ></div>
  );
}
