import Image from "next/image";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { AiOutlineCloseCircle } from "react-icons/ai"; 
import styles from './ImageUpload.module.css';

const ImageUpload = ({ onChange, label, value, disabled }) => {
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

  const handleRemove = () => {
    setBase64(null);
    handleChange(null);
  };

  const { getRootProps, getInputProps } = useDropzone({
    maxFiles: 1,
    onDrop: handleDrop,
    disabled,
    accept: {
      'image/jpeg': [],
      'image/png': [],
      'image/jpg': [],
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
          <button
            className={styles.removeButton}
            onClick={handleRemove}
            disabled={disabled}
          >
            <AiOutlineCloseCircle />
          </button>
        </div>
      ) : (
        <p className={styles.imageUploadLabel}>{label}</p>
      )}
    </div>
  );
};

export default ImageUpload;
