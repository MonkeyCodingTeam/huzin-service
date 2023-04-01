import { Field, FieldAttributes } from 'formik';
import { InputText } from 'primereact/inputtext';
import classNames from 'classnames';
import css from './FloatInput.module.scss';
import { DateTime } from 'luxon';
import { FC } from 'react';

interface FloatInputProps extends FieldAttributes<any> {
  id?: string;
  name: string;
  label: string;
  placeholder?: string;
  title?: string;
  hasFormik?: boolean;
  className?: string;
  inputClassName?: string;
}

export const FloatInput: FC<FloatInputProps> = (props) => {
  const {
    name,
    label,
    id = name + DateTime.now(),
    placeholder = 'Введите...',
    title = '',
    as = InputText,
    hasFormik = true,
    children,
    inputClassName = '',
    className = '',
  } = props;

  return (
    <span className={classNames('p-float-label', css.inputBox, className)} title={title}>
      {hasFormik ? (
        <Field
          as={as}
          id={id}
          name={name}
          placeholder={placeholder}
          className={classNames(css.inputBox__input, inputClassName)}
        />
      ) : (
        children
      )}
      <label htmlFor={id}>{label}</label>
    </span>
  );
};
