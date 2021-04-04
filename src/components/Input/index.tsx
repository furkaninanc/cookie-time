import { InputHTMLAttributes } from 'react';

import cs from 'classnames';

import styles from './Input.module.scss';

const Input: React.FC<InputHTMLAttributes<HTMLInputElement>> = ({
  className,
  onChange,
  placeholder,
}) => (
  <input
    className={cs(className, styles.input)}
    onChange={onChange}
    placeholder={placeholder}
  />
);

export default Input;
