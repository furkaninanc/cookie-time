import { InputHTMLAttributes } from 'react';

import styles from './Button.module.scss';

const Button: React.FC<InputHTMLAttributes<HTMLButtonElement>> = ({
  children,
  onClick,
}) => (
  <button className={styles.button} onClick={onClick} type="button">
    {children}
  </button>
);

export default Button;
