import { FC, RefObject, useCallback, useEffect, useState } from 'react';
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
import { ConfirmPopup } from 'primereact/confirmpopup';
import { PrimeIcons } from 'primereact/api';
import { Button } from 'primereact/button';
import { InvoiceArchiveDialog } from '@entities/invoice/ui/InvoiceArchiveDialog/ui/InvoiceArchiveDialog';
import { DragEndEvent } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';

interface AccountantTableProps {
  toast: RefObject<Toast>;
}

export const AccountantTable: FC<AccountantTableProps> = ({ toast }) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [searchClients, setSearchClients] = useState<Client[]>([]);
  const [search, setSearch] = useState('');
  const [showAddInvoice, setShowAddInvoice] = useState(false);
  const [showInvoiceArchive, setShowInvoiceArchive] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client>();

  useEffect(() => {
    ClientAPI.getClients({ with: ['invoices'] }).then(({ data }) => {
      setClients(data);
    });
  }, []);

  useEffect(() => {
    if (!search.length) {
      return setSearchClients(clients);
    }

    setSearchClients(
      clients.filter((client) => {
        const { entrepreneur, name } = client;
        const searchWord = search.replace(/[^a-zа-я0-9]/gi, '').toLowerCase();

        const isName = name.toLowerCase().search(searchWord);
        const isEntrepreneur = entrepreneur.toLowerCase().search(searchWord);

        return isName > -1 || isEntrepreneur > -1;
      }),
    );
  }, [search, clients]);

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

  const handleDragEnd = (event: DragEndEvent, client: Client) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const { invoices } = client;
      const oldInvoice = invoices.find((invoice) => invoice.id === active.id);
      const newInvoice = invoices.find((invoice) => invoice.id === over?.id);

      if (!oldInvoice || !newInvoice) return;

      const oldIndex = invoices.indexOf(oldInvoice);
      const newIndex = invoices.indexOf(newInvoice);

      setClients((prevState) =>
        prevState.map((item) => {
          if (item.id === client.id) {
            item.invoices = arrayMove(invoices, oldIndex, newIndex);
          }
          return item;
        }),
      );
      const invoiceIds = arrayMove(invoices, oldIndex, newIndex).reduce<Invoice['id'][]>(
        (prev, current) => {
          prev.push(current.id);
          return prev;
        },
        [],
      );
      InvoiceAPI.reorder(invoiceIds).then(({ data }) => {
        setClients((prevState) => {
          return prevState.map((item) => {
            if (item.id === client.id) {
              item.invoices = data;
            }
            return item;
          });
        });
      });
    }
  };

  const handleDeleteInvoice = (invoice: Invoice) => {
    InvoiceAPI.delete(invoice.id).then(({ data }) =>
      setClients((prevState) =>
        prevState.map((client) => {
          if (client.id === data.client_id) {
            client.invoices = client.invoices.filter((item) => item.id !== data.id);
          }
          return client;
        }),
      ),
    );
  };

  const handlePaidInvoice = (invoice: Invoice) => {
    InvoiceAPI.paid(invoice.id).then(({ data }) =>
      setClients((prevState) =>
        prevState.map((client) => {
          if (client.id === data.client_id) {
            client.invoices = client.invoices.map((item) => {
              return item.id === data.id ? data : item;
            });
          }
          return client;
        }),
      ),
    );
  };

  const handlePaidVk = (invoice: Invoice, vk_number: Invoice['vk_number']) => {
    if (!vk_number) return;

    InvoiceAPI.vkPaid(invoice.id, vk_number).then(({ data }) => {
      setClients((prevState) =>
        prevState.map((client) => {
          if (client.id === data.client_id) {
            client.invoices = client.invoices.filter((item) => item.id !== data.id);
          }
          return client;
        }),
      );
    });
  };

  const getInvoices = useCallback(
    (client: Client) => client.invoices.sort((a, b) => a.order - b.order),
    [],
  );

  return (
    <div className={css.container}>
      <InputText placeholder='Поиск' onChange={(e) => setSearch(e.currentTarget.value)} />
      <ConfirmPopup />
      <AddInvoiceDialog
        isOpen={showAddInvoice}
        onClose={() => setShowAddInvoice(false)}
        onSubmit={handleSubmit}
        client={selectedClient}
      />
      <InvoiceArchiveDialog
        isOpen={showInvoiceArchive}
        onHide={() => {
          setShowInvoiceArchive(false);
        }}
        client={selectedClient}
      />
      <ul className={css.clientList}>
        {searchClients.length ? (
          searchClients.map((client) => (
            <li className={css.clientList__item} key={client.id}>
              <div className={css.clientList__item__block}>
                <div className={css.clientList__item__block_info}>
                  <Link
                    target='_blank'
                    href={`https://vk.com/ads?act=office&union_id=${client.id}`}
                  >
                    {client.name}
                  </Link>
                  <span>
                    {client.entrepreneur || (
                      <Link href={`/target/settings/client/${client.id}#invoice`}>Не задан ИП</Link>
                    )}
                  </span>
                  <span>
                    Бюджет: <b>{client.month_plan.toLocaleString()}</b>
                  </span>
                  <span>
                    Сумма оплаты:{' '}
                    <b>
                      {client.basic_payment?.toLocaleString() || (
                        <Link href={`/target/settings/client/${client.id}#invoice`}>Не задана</Link>
                      )}
                    </b>
                  </span>
                </div>
                <div className={css.clientList__item__block__tools}>
                  <Button
                    onClick={() => {
                      setSelectedClient(client);
                      setShowInvoiceArchive(true);
                    }}
                    type='button'
                    title='История счетов'
                    icon={PrimeIcons.CLOCK}
                    area-label='История'
                    severity='info'
                    rounded
                    text
                  />
                  <Button
                    aria-label='addInvoice'
                    label='Добавить счёт'
                    severity='success'
                    outlined
                    onClick={() => {
                      setSelectedClient(client);
                      setShowAddInvoice(true);
                    }}
                  />
                </div>
              </div>
              <InvoiceList
                onDragEnd={(event) => {
                  handleDragEnd(event, client);
                }}
                invoices={client.invoices.sort((a, b) => a.order - b.order)}
                onDelete={handleDeleteInvoice}
                onPaid={handlePaidInvoice}
                onVkPaid={handlePaidVk}
              />
            </li>
          ))
        ) : (
          <span className={css.noResult}>Нет результатов</span>
        )}
      </ul>
    </div>
  );
};
