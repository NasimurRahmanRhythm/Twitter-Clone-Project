import React from 'react';
import styles from './Button.module.css';

const Button = ({
  label,
  secondary,
  fullWidth,
  onClick,
  onChange,
  large,
  disabled,
  outline,
}) => {
  const classNames = [
    styles.button,
    fullWidth ? styles.fullWidth : styles.widthFit,
    secondary ? styles.secondary : styles.primary,
    large ? styles.large : styles.small,
    outline ? styles.outline : '',
    disabled ? styles.disabled : '',
  ].join(' ');

  return (
    <button disabled={disabled} onChange={onChange} onClick={onClick} className={classNames}>
      {label}
    </button>
  );
};

export default Button;
