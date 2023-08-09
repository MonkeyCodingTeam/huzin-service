import { Dialog } from 'primereact/dialog';
import { Form, Formik, FormikValues } from 'formik';
import css from './EditClientModal.module.scss';
import { FloatInput } from '@shared/ui/FloatInput';
import { Button } from 'primereact/button';
import { emptyClientState } from '@entities/client/model/client';
import { Client } from '@entities/client';

type EditClientFields = Pick<Client, 'critical_balance' | 'month_plan' | 'budget_adjustment'>;

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
    budget_adjustment: client.budget_adjustment,
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
            <FloatInput label='План на месяц' name='month_plan' />
            <FloatInput label='Критический остаток' name='critical_balance' />
            <FloatInput label='Корректировка бюджета' name='budget_adjustment' />
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
