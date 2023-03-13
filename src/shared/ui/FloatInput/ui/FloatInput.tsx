import { Field, FieldAttributes } from 'formik';
import { InputText } from 'primereact/inputtext';
import classNames from 'classnames';
import css from './FloatInput.module.scss';
import { DateTime } from 'luxon';

interface FloatInputProps extends FieldAttributes<any> {
  id?: string;
  name: string;
  label: string;
  placeholder?: string;
  title?: string;
}

export const FloatInput = (props: FloatInputProps) => {
  const { name, label, id = name + DateTime.now(), placeholder = 'Введите...', title = '' } = props;

  return (
    <span className={classNames('p-float-label', css.input)} title={title}>
      <Field as={InputText} id={id} name={name} placeholder={placeholder} />
      <label htmlFor={id}>{label}</label>
    </span>
  );
};
