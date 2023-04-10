import { FieldAttributes } from 'formik';
import classNames from 'classnames';
import css from './FloatInput.module.scss';
import { DateTime } from 'luxon';
import { FC } from 'react';

interface FloatInputProps extends FieldAttributes<any> {
  label: string;
  placeholder?: string;
  title?: string;
  className?: string;
  inputClassName?: string;
}

export const FloatInput: FC<FloatInputProps> = (props) => {
  const { name, label, id = name + DateTime.now(), title = '', children, className = '' } = props;

  return (
    <span className={classNames('p-float-label', css.inputBox, className)} title={title}>
      {children}
      <label>{label}</label>
    </span>
  );
};
