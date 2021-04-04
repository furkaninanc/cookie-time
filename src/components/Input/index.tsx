import { InputHTMLAttributes } from 'react';

import styles from './Input.module.scss';

const Input: React.FC<InputHTMLAttributes<HTMLInputElement>> = ({
  onChange,
  placeholder,
}) => (
  <input
    className={styles.input}
    onChange={onChange}
    placeholder={placeholder}
  />
);

export default Input;
