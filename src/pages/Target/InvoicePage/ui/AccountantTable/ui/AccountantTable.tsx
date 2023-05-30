import { TableLoader } from '@widgets';
import { Client } from '@entities/client';
import { DataTable, DataTableDataSelectableEvent } from 'primereact/datatable';
import { FC, RefObject, useCallback, useEffect, useState } from 'react';
import { ClientAPI } from '@shared/lib/api';
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

interface AccountantTableProps {
  toast: RefObject<Toast>;
}

export const AccountantTable: FC<AccountantTableProps> = ({ toast }) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [clientsData, setClientsData] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [isInvoiceHidden, setIsInvoiceHidden] = useState(true);

  useEffect(() => {
    getClients();
    const interval = setInterval(() => {
      getClients();
    }, 60000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const getClients = useCallback(() => {
    ClientAPI.getClients().then((res) => {
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
        <span className={css.filterInvoice}>
          {client.recommended_budget?.toLocaleString()}
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
    ClientAPI.deleteInvoice(client.current_invoice_id).then((res) => {
      setClients((prevState) =>
        prevState.map((client) => (res.data.id === client.id ? res.data : client)),
      );
    });
  };

  const invoiceBody = (client: Client) => {
    if (client.current_invoice_id) {
      return (
        <span className='p-buttonset'>
          <Button
            severity='info'
            icon={PrimeIcons.EYE}
            type='button'
            onClick={() => getCurrentInvoice(client)}
            label='Просмотреть файл'
          />
          <Button
            severity='danger'
            icon={PrimeIcons.TIMES}
            type='button'
            onClick={() => removeCurrentInvoice(client)}
          />
        </span>
      );
    }

    return <Badge value='Нет счёта' severity='warning' />;
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
    ClientAPI.invoicePaid(client.current_invoice_id).then((res) => {
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

  return (
    <>
      <ConfirmPopup />
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
          <Column header='Загрузка' align='center' body={invoiceTemplate} />
          <Column header='Оплачен' align='center' body={paidTemplate} />
        </DataTable>
      </TableLoader>
    </>
  );
};
