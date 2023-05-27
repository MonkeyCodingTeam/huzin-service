import { TableLoader } from '@widgets';
import { Client } from '@entities/client';
import { DataTable } from 'primereact/datatable';
import { FC, RefObject, useCallback, useEffect, useState } from 'react';
import { ClientAPI } from '@shared/lib/api';
import { Column } from 'primereact/column';
import { FileUpload } from 'primereact/fileupload';
import { Toast } from 'primereact/toast';

interface AccountantTableProps {
  toast: RefObject<Toast>;
}

export const AccountantTable: FC<AccountantTableProps> = ({ toast }) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

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
      setClients(() => res.data.filter((client) => !!client.is_budget_agreed));
      setLoading(false);
    });
  }, []);
  const onUpload = () => {
    toast.current?.show({ severity: 'info', summary: 'Success', detail: 'File Uploaded' });
  };

  const invoiceTemplate = () => (
    <FileUpload
      name='demo[]'
      url='/api/upload'
      accept='.pdf'
      maxFileSize={10000000}
      chooseLabel='Прикрепить счёт'
      uploadOptions={{
        label: 'Загрузить',
      }}
      onUpload={onUpload}
    />
  );
  return (
    <TableLoader isLoading={loading}>
      <DataTable
        value={clients}
        scrollable
        scrollHeight='calc(100vh - 120px)'
        selectionMode='single'
        key='id'
        sortField='is_budget_agreed'
        sortOrder={-1}
      >
        <Column field='name' header='Клиент' style={{ maxWidth: '10rem' }} />
        <Column
          field='recommended_budget'
          header='Рекомндованный бюджет'
          body={(client: Client) => client.recommended_budget || '-'}
        />
        <Column header='Счёт' align='center' />
        <Column header='Загрузка' align='center' body={invoiceTemplate} />
      </DataTable>
    </TableLoader>
  );
};
