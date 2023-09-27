import React, { useCallback, useState } from "react";
import { FiImage, RxCross2 } from "react-icons/fa";
import { useDropzone } from "react-dropzone";
import styles from "./PostImageUpload.module.css";

const PostImageUpload = ({ onChange, label, value, disabled }) => {
  const [base64, setBase64] = useState(value);

  const handleChange = useCallback((base64) => {
    onChange(base64);
  }, [onChange]);

  const handleDrop = useCallback((files) => {
    const file = files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      setBase64(event.target.result);
      handleChange(event.target.result);
    };
    reader.readAsDataURL(file);
  }, [handleChange]);

  const handleRemove = useCallback(() => {
    setBase64(undefined);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    maxFiles: 1,
    onDrop: handleDrop,
    disabled,
    accept: {
      "image/jpeg": [],
      "image/png": [],
    },
  });

  return (
    <div
      {...getRootProps({
        className: styles.imageUploadContainer,
      })}
    >
      <input {...getInputProps()} />
      {base64 ? (
        <div className={styles.imageWrapper}>
          <Image
            src={base64}
            height="100"
            width="100"
            alt="Uploaded image"
          />
          <RxCross2
            size={24}
            onClick={handleRemove}
            className={styles.removeButton}
          />
        </div>
      ) : (
        <div className={styles.uploadIconWrapper}>
          <FiImage size={24} className={styles.uploadIcon} />
          <p className={styles.imageUploadLabel}>{label}</p>
        </div>
      )}
    </div>
  );
};

export default PostImageUpload;
