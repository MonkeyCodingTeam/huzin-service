import { FC, RefObject, useEffect, useState } from 'react';
import { Toast } from 'primereact/toast';
import { Client, ClientAPI } from '@entities/client';
import css from './AccountantTable.module.scss';
import { Invoice } from '@entities/invoice';
import { Link } from '@shared/ui';

interface AccountantTableProps {
  toast: RefObject<Toast>;
}

export const AccountantTable: FC<AccountantTableProps> = ({ toast }) => {
  const [clients, setClients] = useState<Client[]>([]);

  useEffect(() => {
    ClientAPI.getClients({ with: ['invoices'] }).then(({ data }) => {
      setClients(data);
    });
  }, []);

  const invoiceList = (invoices: Invoice[]) => {
    if (!invoices.length) return;

    return (
      <ul className={css.invoiceList}>
        {invoices.map((invoice) => (
          <li className={css.invoiceList__item} key={invoice.id}>
            <span>{invoice.number}</span>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <ul className={css.clientList}>
      {clients.map((client) => (
        <li className={css.clientList__item} key={client.id}>
          <div className={css.clientList__item__header}>
            <span>{client.name}</span>
            <span>
              {client.entrepreneur || (
                <Link href={`/target/settings/client/${client.id}`}>Не задан ИП</Link>
              )}
            </span>
          </div>
          {invoiceList(client.invoices)}
        </li>
      ))}
    </ul>
  );
};
