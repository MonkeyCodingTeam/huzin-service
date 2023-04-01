import { useEffect, useState } from 'react';
import { ClientAPI } from '@shared/lib/api';
import { Client } from '@shared/lib/api/target/types';
import { ListBox, ListBoxChangeEvent } from 'primereact/listbox';
import css from './ClientsList.module.scss';

interface ClientsListProps {
  client?: Client;
  clientId?: Client['id'];
  onChange?: (e: ListBoxChangeEvent) => void;
}

// TODO add scroll to selected
export const ClientsList = ({ client, clientId, onChange }: ClientsListProps) => {
  const [clients, setClients] = useState<Client[]>();

  useEffect(() => {
    ClientAPI.getClients().then((res) => {
      setClients(res.data);
    });
  }, []);

  return (
    <div className={css.list}>
      <ListBox
        value={client?.id || clientId}
        listStyle={{ height: 'calc(100vh - 150px)' }}
        filter
        filterPlaceholder='Поиск'
        options={clients}
        optionValue='id'
        optionLabel='name'
        onChange={onChange}
      />
    </div>
  );
};
