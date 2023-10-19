import clsx from 'clsx';
import { forwardRef } from 'react';
import styles from './Input.module.css';

const Select = forwardRef(function Select(
  {
    label,
    placeholder,
    className,
    htmlType,
    size,
    ariaLabel,
    selectOptions,
    onChange,
    required,
    hasNone,
    value
  },
  ref
) {
  return (
    <div className={clsx(styles.root, className)}>
      <label>
        {label && <div className={styles.label}>{label}</div>}
        <select
          type={htmlType}
          placeholder={placeholder}
          ref={ref}
          className={clsx(styles.input, size && styles[size])}
          aria-label={ariaLabel}
          required={required}
          onChange={onChange}
          value={value}
        >
          {hasNone ? <option key={0} value={""}>None</option> : undefined}
          {selectOptions?.map((selectOption) => (
            <option key={selectOption?.value || selectOption?._id} value={selectOption?.value || selectOption?._id}>{selectOption?.name || selectOption?.title}</option>
          ))}
        </select>
      </label>
    </div>
  );
});

export default Select;
