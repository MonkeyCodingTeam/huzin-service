import { FC, MouseEvent, RefObject, useEffect, useState } from 'react';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Toast } from 'primereact/toast';
import { Invoice, InvoiceAPI, isInvoiceFullFilled } from '@entities/invoice';
import classNames from 'classnames';
import { InputText } from 'primereact/inputtext';
import { Field, Form, Formik, FormikValues } from 'formik';
import { Button } from 'primereact/button';
import { Badge } from 'primereact/badge';
import { confirmPopup } from 'primereact/confirmpopup';
import { PrimeIcons } from 'primereact/api';
import { FileUpload, FileUploadHandlerEvent } from 'primereact/fileupload';

interface AccountantTableProps {
  toast: RefObject<Toast>;
}

export const AccountantTable: FC<AccountantTableProps> = ({ toast }) => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [expandedRows, setExpandedRows] = useState<Invoice[]>([]);

  useEffect(() => {
    InvoiceAPI.get().then(({ data }) => {
      setInvoices(data);
    });
  }, []);

  const headerTemplate = (data: Invoice) => {
    return <span>{data.client.name}</span>;
  };

  const vkPaidTemplate = (data: Invoice) => {
    if (data.vk_paid_at) {
      return <Badge severity='success' value='Оплачен' />;
    }

    return (
      <Formik
        onSubmit={(values) => {
          submitVkInvoice({ id: data.id, ...values });
        }}
        initialValues={{ vk_number: data.vk_number || '' }}
      >
        <Form
          className={classNames('p-inputgroup', {
            'p-disabled': !data.paid_at,
          })}
          style={{ justifyContent: 'center' }}
        >
          <Field
            as={InputText}
            name='vk_number'
            style={{ maxWidth: '8rem' }}
            placeholder='Счёт вк'
          />
          <Button label='Не оплачен' severity='danger' type='submit' />
        </Form>
      </Formik>
    );
  };

  const paidAccept = (invoice: Invoice) => {
    console.log(invoice);
  };

  const paidConfirm = (ivoice: Invoice, event: MouseEvent<HTMLButtonElement>) => {
    confirmPopup({
      target: event.currentTarget,
      message: 'Счёт оплачен?',
      acceptLabel: 'Да',
      rejectLabel: 'Нет',
      icon: 'pi pi-exclamation-triangle',
      accept: () => paidAccept(ivoice),
    });
  };

  const paidTemplate = (data: Invoice) => {
    if (data.paid_at) {
      return <Badge severity='success' value='Оплачен' />;
    }
    return (
      <Button
        label='Не оплачен'
        severity='danger'
        disabled={!data.path}
        onClick={(e) => paidConfirm(data, e)}
      />
    );
  };
  const submitVkInvoice = (value: FormikValues) => {
    console.log(value);
  };

  const uploadInvoice = (invoice: Invoice, event: FileUploadHandlerEvent) => {
    const file = event.files.pop();
    if (!file) return;

    toast.current?.show({ severity: 'info', summary: 'Сохранено', detail: 'Счёт добавлен' });
  };

  const invoiceTemplate = (data: Invoice) => (
    <FileUpload
      auto
      customUpload
      uploadHandler={(event) => uploadInvoice(data, event)}
      mode='basic'
      name='invoice[]'
      accept='.pdf'
      maxFileSize={10000000}
      chooseLabel='Прикрепить счёт'
    />
  );
  const invoiceBody = (data: Invoice) => (
    <span className='p-buttonset'>
      {!isInvoiceFullFilled(data) && (
        <Button
          icon={PrimeIcons.EXCLAMATION_TRIANGLE}
          title={'Данные счёта не заполнены'}
          severity='warning'
        />
      )}
      <Button icon={PrimeIcons.PENCIL} type='button' title='Редактировать данные счёта' />
      {/*<Button*/}
      {/*  severity='info'*/}
      {/*  icon={PrimeIcons.EYE}*/}
      {/*  type='button'*/}
      {/*  title={invoiceTitle}*/}
      {/*  onClick={() => getCurrentInvoice(client)}*/}
      {/*/>*/}
      {/*<Button*/}
      {/*  severity='danger'*/}
      {/*  icon={PrimeIcons.TIMES}*/}
      {/*  type='button'*/}
      {/*  title='Удалить счёт'*/}
      {/*  onClick={() => removeCurrentInvoice(client)}*/}
      {/*/>*/}
    </span>
  );

  return (
    <DataTable
      value={invoices}
      rowGroupMode='subheader'
      groupRowsBy='client_id'
      sortMode='single'
      sortField='client.name'
      sortOrder={1}
      expandableRowGroups
      expandedRows={expandedRows}
      onRowToggle={(e) => setExpandedRows(e.data as Invoice[])}
      rowGroupHeaderTemplate={headerTemplate}
      tableStyle={{ minWidth: '50rem' }}
    >
      <Column field='sum' header='Сумма'></Column>
      <Column header='Счёт' body={invoiceBody} style={{ width: '20%' }}></Column>
      <Column field='paid_at' header='Оплачен' style={{ width: '20%' }}></Column>
      <Column header='Оплачен' body={paidTemplate} style={{ width: '20%' }}></Column>
      <Column header='Оплачен ВК' style={{ width: '20%' }} body={vkPaidTemplate} />
    </DataTable>
  );
};
