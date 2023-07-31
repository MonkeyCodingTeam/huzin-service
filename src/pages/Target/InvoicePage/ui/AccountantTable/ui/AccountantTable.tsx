import { FC, MouseEvent, RefObject, useCallback, useEffect, useState } from 'react';
import { Toast } from 'primereact/toast';
import { Client, ClientAPI } from '@entities/client';
import css from './AccountantTable.module.scss';
import { AddInvoiceDialog, Invoice, InvoiceAPI, InvoiceWithFile } from '@entities/invoice';
import { Link } from '@shared/ui';
import { InputText } from 'primereact/inputtext';
import { PrimeIcons } from 'primereact/api';
import classNames from 'classnames';
import { ConfirmPopup, confirmPopup } from 'primereact/confirmpopup';
import { Button } from 'primereact/button';

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

  const invoiceList = (invoices: Invoice[]) => {
    return (
      <ul className={css.invoiceList}>
        {invoices.map((invoice) => (
          <li className={css.invoiceList__item} key={invoice.id}>
            <span className={css.invoiceList__item__title}>
              <i
                className={classNames(PrimeIcons.FILE)}
                style={{ color: 'var(--primary-color)' }}
              />
              № {invoice.number}
            </span>
            <span>
              {invoice.entrepreneur} ИНН {invoice.inn}
            </span>
            <span>Сумма: {invoice.sum}</span>
            <div>
              <Button
                type='button'
                icon='pi pi-trash'
                area-label='Удалить'
                severity='danger'
                text
                onClick={(event) => confirmRemove(event, invoice)}
              />
            </div>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className={css.container}>
      <ConfirmPopup />
      <InputText placeholder='Поиск' />
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
            {invoiceList(client.invoices)}
          </li>
        ))}
      </ul>
    </div>
  );
};
