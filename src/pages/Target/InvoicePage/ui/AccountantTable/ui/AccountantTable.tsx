import { TableLoader } from '@widgets';
import { Client, Invoice } from '@entities/client';
import { DataTable, DataTableDataSelectableEvent } from 'primereact/datatable';
import { FC, RefObject, useCallback, useEffect, useState } from 'react';
import { ClientAPI, InvoiceApi } from '@shared/lib/api';
import { Column } from 'primereact/column';
import { FileUpload, FileUploadHandlerEvent } from 'primereact/fileupload';
import { Toast } from 'primereact/toast';
import { Badge } from 'primereact/badge';
import { Button } from 'primereact/button';
import { PrimeIcons } from 'primereact/api';
import { Checkbox } from 'primereact/checkbox';
import css from './AccountantTable.module.scss';
import { CopyToClipboardButton } from '@shared/ui/CopyToClipboardButton';
import { confirmPopup, ConfirmPopup } from 'primereact/confirmpopup';
import { InputNumber, InputNumberValueChangeEvent } from 'primereact/inputnumber';
import { Dialog } from 'primereact/dialog';
import { Field, Form, Formik, FormikValues } from 'formik';
import { InputText } from 'primereact/inputtext';
import { FloatInput } from '@shared/ui';

interface AccountantTableProps {
  toast: RefObject<Toast>;
}

export const AccountantTable: FC<AccountantTableProps> = ({ toast }) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [clientsData, setClientsData] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [isInvoiceHidden, setIsInvoiceHidden] = useState(true);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice>();

  useEffect(() => {
    getClients();
    const interval = setInterval(() => {
      getClients();
    }, 1000 * 60 * 10);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const getClients = useCallback(() => {
    ClientAPI.getClients({ with: ['currentInvoice'] }).then((res) => {
      setClients(res.data);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    setClientsData(() => {
      if (isInvoiceHidden) {
        return clients.filter((client) => !client.current_invoice_id);
      }
      return clients;
    });
  }, [clients, isInvoiceHidden]);

  const recommendedBudgetTemplate = (client: Client) => {
    if (client.is_budget_agreed) {
      return (
        <span className='p-inputgroup' style={{ maxWidth: '12rem' }}>
          <InputNumber
            value={client.recommended_budget}
            onValueChange={(e) => changeRecommendedBudget(client, e)}
          />
          <CopyToClipboardButton text={client.recommended_budget?.toString() || ''} />
        </span>
      );
    }

    return <Badge value='Не согласован' severity='warning' />;
  };

  const uploadInvoice = (client: Client, event: FileUploadHandlerEvent) => {
    const file = event.files.pop();
    if (!file) return;

    ClientAPI.uploadInvoice(client.id, file).then((res) => {
      setClients((prevState) =>
        prevState.map((client) => (res.data.id === client.id ? res.data : client)),
      );
      toast.current?.show({ severity: 'info', summary: 'Сохранено', detail: 'Счёт добавлен' });
    });
  };

  const invoiceTemplate = (client: Client) => (
    <FileUpload
      auto
      customUpload
      uploadHandler={(event) => uploadInvoice(client, event)}
      mode='basic'
      name='invoice[]'
      accept='.pdf'
      maxFileSize={10000000}
      chooseLabel='Прикрепить счёт'
    />
  );

  const isClientAgreed = (client: Client) => !!client.is_budget_agreed;

  // @ts-ignore
  const isRowAvailable = (event: DataTableDataSelectableEvent) =>
    event.data ? isClientAgreed(event.data) : true;

  const rowClassName = (client: Client) => (client.is_budget_agreed ? '' : 'p-disabled');

  const getCurrentInvoice = (client: Client) => {
    ClientAPI.getCurrentInvoice(client.id).then((res) => {
      console.log(res);
      const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
      window.open(url);
    });
  };

  const removeCurrentInvoice = (client: Client) => {
    if (!client.current_invoice_id) return;
    InvoiceApi.deleteInvoice(client.current_invoice_id).then((res) => {
      setClients((prevState) =>
        prevState.map((client) => (res.data.id === client.id ? res.data : client)),
      );
    });
  };

  const invoiceBody = (client: Client) => {
    const { current_invoice } = client;
    if (current_invoice) {
      let invoiceTitle = '';
      if (current_invoice) {
        invoiceTitle = getInvoiceText(current_invoice);
      }
      return (
        <>
          <span className='p-buttonset'>
            {!isInvoiceFullFilled(current_invoice) && (
              <Button
                icon={PrimeIcons.EXCLAMATION_TRIANGLE}
                title={'Данные счёта не заполнены'}
                severity='warning'
              />
            )}
            <Button
              icon={PrimeIcons.PENCIL}
              type='button'
              title='Редактировать данные счёта'
              onClick={() => setSelectedInvoice(current_invoice)}
            />
            <Button
              severity='info'
              icon={PrimeIcons.EYE}
              type='button'
              title={invoiceTitle}
              onClick={() => getCurrentInvoice(client)}
            />
            <Button
              severity='danger'
              icon={PrimeIcons.TIMES}
              type='button'
              title='Удалить счёт'
              onClick={() => removeCurrentInvoice(client)}
            />
          </span>
        </>
      );
    }

    return invoiceTemplate(client);
  };

  const header = () => {
    return (
      <div className={css.filterInvoice}>
        <label htmlFor='invoiceShow'>Скрыть клиентов со счетами</label>
        <Checkbox
          id='invoiceShow'
          checked={isInvoiceHidden}
          onChange={() => setIsInvoiceHidden(!isInvoiceHidden)}
        />
      </div>
    );
  };

  const paidAccept = (client: Client) => {
    InvoiceApi.invoicePaid(client.current_invoice_id).then((res) => {
      setClients((prevState) =>
        prevState.map((client) => (res.data.id === client.id ? res.data : client)),
      );
      toast.current?.show({ severity: 'info', summary: client.name, detail: 'Счёт оплачен' });
    });
  };

  // @ts-ignore
  const paidConfirm = (client: Client, event: MouseEvent<HTMLButtonElement, MouseEvent>) => {
    confirmPopup({
      target: event.currentTarget,
      message: 'Счёт оплачен?',
      acceptLabel: 'Да',
      rejectLabel: 'Нет',
      icon: 'pi pi-exclamation-triangle',
      accept: () => paidAccept(client),
    });
  };

  const paidTemplate = (client: Client) => {
    return <Button label='Оплачен' onClick={(e) => paidConfirm(client, e)} />;
  };

  const changeRecommendedBudget = useCallback(
    (client: Client, event: InputNumberValueChangeEvent) => {
      ClientAPI.updateInvoice(client, {
        recommended_budget: event.value || null,
      }).then((res) => {
        setClients((prevState) =>
          prevState.map((client) => (client.id === res.data.id ? res.data : client)),
        );
        toast.current?.show({
          severity: 'success',
          detail: 'Сохранено!',
          summary: client.name,
          life: 2000,
        });
      });
    },
    [],
  );

  const submitInvoiceChange = (invoice: FormikValues) => {
    const { number, inn, customer } = invoice;
    InvoiceApi.updateInvoice(invoice.id, { number, inn, customer }).then((res) => {
      setClients((prevState) =>
        prevState.map((client) => {
          if (client.id === res.data.client_id) {
            client.current_invoice = res.data;
          }
          return client;
        }),
      );
      setSelectedInvoice(undefined);
    });
  };

  return (
    <>
      <ConfirmPopup />
      <Dialog
        visible={!!selectedInvoice}
        onHide={() => setSelectedInvoice(undefined)}
        header='Редактирование'
      >
        <Formik onSubmit={submitInvoiceChange} initialValues={selectedInvoice!}>
          <Form>
            <div className={css.form__body}>
              <FloatInput label='Номер счёта'>
                <Field as={InputText} name='number' />
              </FloatInput>
              <FloatInput label='Заказчик'>
                <Field as={InputText} name='customer' />
              </FloatInput>
              <FloatInput label='ИНН'>
                <Field as={InputText} name='inn' />
              </FloatInput>
            </div>
            <div className={css.form__footer}>
              <Button
                type='button'
                label='Отменить'
                severity='secondary'
                onClick={() => setSelectedInvoice(undefined)}
              />
              <Button type='submit' label='Сохранить' />
            </div>
          </Form>
        </Formik>
      </Dialog>
      <TableLoader isLoading={loading}>
        <DataTable
          value={clientsData}
          scrollable
          scrollHeight='calc(100vh - 120px)'
          selectionMode='single'
          key='id'
          sortField='is_budget_agreed'
          sortOrder={-1}
          isDataSelectable={isRowAvailable}
          rowClassName={rowClassName}
          header={header}
        >
          <Column field='name' header='Клиент' style={{ maxWidth: '10rem' }} />
          <Column
            field='recommended_budget'
            header='Рекомндованный бюджет'
            body={recommendedBudgetTemplate}
          />
          <Column
            field='current_invoice_id'
            header='Счёт'
            bodyStyle={{ minWidth: '14rem' }}
            align='center'
            body={invoiceBody}
          />
          <Column header='Оплачен' align='center' body={paidTemplate} />
        </DataTable>
      </TableLoader>
    </>
  );
};

const getInvoiceText = (invoice: Invoice) => {
  return `Счёт № ${invoice.number}
Сумма ${invoice.budget.toLocaleString()}
${invoice.customer} 
ИНН ${invoice.inn}`;
};

const isInvoiceFullFilled = (invoice: Invoice) => {
  return invoice.budget && invoice.inn && invoice.customer;
};