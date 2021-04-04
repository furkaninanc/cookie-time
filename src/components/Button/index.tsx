import { InputHTMLAttributes } from 'react';

import cs from 'classnames';

import styles from './Button.module.scss';

const Button: React.FC<InputHTMLAttributes<HTMLButtonElement>> = ({
  className,
  children,
  onClick,
}) => (
  <button
    className={cs(className, styles.button)}
    onClick={onClick}
    type="button"
  >
    {children}
  </button>
);

export default Button;
