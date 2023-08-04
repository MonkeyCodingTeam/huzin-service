import { FC, MouseEvent, RefObject, useCallback, useEffect, useState } from 'react';
import { Toast } from 'primereact/toast';
import { Client, ClientAPI } from '@entities/client';
import css from './AccountantTable.module.scss';
import {
  AddInvoiceDialog,
  Invoice,
  InvoiceAPI,
  InvoiceList,
  InvoiceWithFile,
} from '@entities/invoice';
import { Link } from '@shared/ui';
import { InputText } from 'primereact/inputtext';
import { ConfirmPopup, confirmPopup } from 'primereact/confirmpopup';

interface AccountantTableProps {
  toast: RefObject<Toast>;
}

export const AccountantTable: FC<AccountantTableProps> = ({ toast }) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [showAddInvoice, setShowAddInvoice] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client>();

  useEffect(() => {
    ClientAPI.getClients({ with: ['invoices'] }).then(({ data }) => {
      setClients(data);
    });
  }, []);

  const handleSubmit = (values: InvoiceWithFile) => {
    if (!selectedClient) return;

    InvoiceAPI.create(selectedClient.id, values).then(({ data }) => {
      setClients((prevState) => {
        return prevState.map((client) => {
          if (client.id === data.client_id) {
            client.invoices.push(data);
          }
          return client;
        });
      });
      setShowAddInvoice(false);
    });
  };

  const confirmRemove = useCallback((e: MouseEvent<HTMLButtonElement>, invoice: Invoice) => {
    confirmPopup({
      target: e.currentTarget,
      message: 'Хотите удалить счёт?',
      accept: () => {
        InvoiceAPI.delete(invoice.id).then(({ data }) => {
          return setClients((prevState) =>
            prevState.map((client) => {
              client.invoices = client.invoices.filter((item) => item.id !== data.id);
              return client;
            }),
          );
        });
      },
      acceptLabel: 'Да',
      rejectLabel: 'Отмена',
    });
  }, []);

  // const handleDragEnd = (event: DragEndEvent, client: Client) => {
  //   const { active, over } = event;
  //
  //   if (active.id !== over?.id) {
  //     setClients((prevState) =>
  //       prevState.map((item) => {
  //         if (item.id === client.id) {
  //           const { invoices } = client;
  //
  //           const oldInvoice = invoices.find((invoice) => invoice.id === active.id);
  //           const newInvoice = invoices.find((invoice) => invoice.id === over?.id);
  //
  //           if (!oldInvoice || !newInvoice) return client;
  //
  //           const oldIndex = invoices.indexOf(oldInvoice);
  //           const newIndex = invoices.indexOf(newInvoice);
  //
  //           item.invoices = arrayMove(invoices, oldIndex, newIndex);
  //
  //           const invoiceIds = item.invoices.reduce<Invoice['id'][]>((prev, current) => {
  //             prev.push(current.id);
  //             return prev;
  //           }, []);
  //           InvoiceAPI.reorder(invoiceIds).then();
  //         }
  //         return item;
  //       }),
  //     );
  //   }
  // };

  return (
    <div className={css.container}>
      <InputText placeholder='Поиск' />
      <ConfirmPopup />
      <AddInvoiceDialog
        isOpen={showAddInvoice}
        onClose={() => setShowAddInvoice(false)}
        onSubmit={handleSubmit}
        title={selectedClient?.name}
      />
      <ul className={css.clientList}>
        {clients.map((client) => (
          <li className={css.clientList__item} key={client.id}>
            <div className={css.clientList__item__block}>
              <Link target='_blank' href={`https://vk.com/ads?act=office&union_id=${client.id}`}>
                {client.name}
              </Link>
              <span>
                {client.entrepreneur || (
                  <Link href={`/target/settings/client/${client.id}`}>Не задан ИП</Link>
                )}
              </span>
              <div className={css.clientList__item__block__tools}>
                <span>Бюджет: {client.month_plan.toLocaleString()}</span>
                <button
                  aria-label='addInvoice'
                  className={css.clientList__item__block__addInvoice}
                  onClick={() => {
                    setSelectedClient(client);
                    setShowAddInvoice(true);
                  }}
                />
              </div>
            </div>
            <InvoiceList
              // onDragEnd={(event) => {
              //   handleDragEnd(event, client);
              // }}
              invoices={client.invoices}
            />
          </li>
        ))}
      </ul>
    </div>
  );
};
