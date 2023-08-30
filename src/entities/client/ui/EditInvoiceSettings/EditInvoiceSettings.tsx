import { Field, Form, Formik, FormikValues } from 'formik';
import css from './EditInvoiceSettings.module.scss';
import { Input, InputGroup } from '@shared/ui';
import { Client, ClientAPI } from '@entities/client';
import { Button } from 'primereact/button';
import { FC, useRef } from 'react';
import { Toast } from 'primereact/toast';

interface EditInvoiceSettingsProps {
  client: Client;
}

export const EditInvoiceSettings: FC<EditInvoiceSettingsProps> = ({ client }) => {
  const toast = useRef<Toast>(null);

  const handleSubmit = (values: FormikValues) => {
    ClientAPI.updateClient(client.id, values).then(() => {
      toast.current?.show({ severity: 'success', summary: 'Сохранено!' });
    });
  };

  return (
    <Formik
      initialValues={{
        entrepreneur: client.entrepreneur,
        basic_payment: client.basic_payment || '',
      }}
      onSubmit={handleSubmit}
    >
      <Form className={css.invoiceBlock}>
        <Toast ref={toast} />
        <InputGroup>
          <Field
            as={Input}
            label='Владелец'
            value={client.entrepreneur || ''}
            name='entrepreneur'
            placeholder={'Не задан'}
          />
        </InputGroup>
        <InputGroup>
          <Field
            as={Input}
            label='Сумма для оплаты'
            value={client.basic_payment || ''}
            name='basic_payment'
            placeholder={'Не задана'}
          />
        </InputGroup>
        <Button style={{ width: 'fit-content' }} type='submit' label='Сохранить' />
      </Form>
    </Formik>
  );
};
