import { InputHTMLAttributes } from 'react';

import cs from 'classnames';

import styles from './Input.module.scss';

const Input: React.FC<InputHTMLAttributes<HTMLInputElement>> = ({
  className,
  onChange,
  onKeyDown,
  placeholder,
  value,
}) => (
  <input
    className={cs(className, styles.input)}
    onChange={onChange}
    onKeyDown={onKeyDown}
    placeholder={placeholder}
    value={value}
  />
);

export default Input;
