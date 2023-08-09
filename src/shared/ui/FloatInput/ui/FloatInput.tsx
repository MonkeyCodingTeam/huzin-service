import { FieldAttributes, useField } from 'formik';
import classNames from 'classnames';
import css from './FloatInput.module.scss';
import { FC } from 'react';

interface FloatInputProps extends FieldAttributes<any> {
  label: string;
  name: string;
  placeholder?: string;
  title?: string;
  className?: string;
  inputClassName?: string;
}

export const FloatInput: FC<FloatInputProps> = (props) => {
  const { label, title, className, inputClassName, name, ...ref } = props;

  const [field, { touched, error }, { setValue }] = useField(props);

  return (
    <span className={classNames(css.inputBox, className)} title={title || label}>
      <input
        id={`floatInput_${name}`}
        placeholder=' '
        className={classNames(css.inputBox__input, inputClassName, {
          [css.inputBox__input_error]: error && touched,
        })}
        {...field}
        {...ref}
      />
      <label htmlFor={`floatInput_${name}`} className={css.inputBox__label} title={label}>
        {label}
      </label>
      <label htmlFor={`floatInput_${name}`} className={css.inputBox__error} title={error}>
        {touched && error}
      </label>
    </span>
  );
};
