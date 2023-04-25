import React from 'react';

import styles from './Input.module.css';

const Input = ({
  placeholder,
  value,
  type,
  onChange,
  disabled,
  label,
}) => {
  return (
    <input
      disabled={disabled}
      onChange={onChange}
      value={value}
      placeholder={placeholder}
      type={type}
      className={styles.input}
    />
  );
};

export default Input;
