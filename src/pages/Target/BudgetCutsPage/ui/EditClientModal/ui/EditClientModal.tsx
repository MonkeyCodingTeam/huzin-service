import { Dialog } from 'primereact/dialog';
import { Field, Form, Formik, FormikValues } from 'formik';
import css from './EditClientModal.module.scss';
import { FloatInput } from '@shared/ui/FloatInput';
import { Button } from 'primereact/button';
import { emptyClientState } from '@entities/client/model/client';
import { Client } from '@entities/client';
import { InputText } from 'primereact/inputtext';

type EditClientFields = Pick<Client, 'critical_balance' | 'month_plan'>;

interface EditClientProps {
  client?: Client;
  visible: boolean;
  onSubmit: (values: FormikValues) => void;
  onHide: () => void;
}

export const EditClientModal = ({
  client = emptyClientState,
  visible,
  onHide,
  onSubmit,
}: EditClientProps) => {
  const editProps: EditClientFields = {
    critical_balance: client.critical_balance,
    month_plan: client.month_plan,
  };

  return (
    <Dialog
      headerClassName={css.modal__header}
      header={client.name}
      visible={visible}
      onHide={onHide}
    >
      <Formik initialValues={editProps} onSubmit={onSubmit}>
        <Form className={css.form}>
          <div className={css.form__body}>
            <FloatInput label='План на месяц'>
              <Field as={InputText} name='month_plan' />
            </FloatInput>
            <FloatInput label='Критический остаток'>
              <Field as={InputText} name='critical_balance' />
            </FloatInput>
          </div>
          <div className={css.form__footer}>
            <Button type='button' label='Отменить' severity='secondary' onClick={onHide} />
            <Button type='submit' label='Сохранить' />
          </div>
        </Form>
      </Formik>
    </Dialog>
  );
};
