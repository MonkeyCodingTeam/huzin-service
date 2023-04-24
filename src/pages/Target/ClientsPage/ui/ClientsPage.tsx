import { Helmet } from 'react-helmet-async';
import css from './ClientsPage.module.scss';
import { useEffect, useState } from 'react';
import { Outlet, useNavigate, useParams } from 'react-router';
import { ListBox, ListBoxChangeEvent } from 'primereact/listbox';
import { ROUTES } from '@shared/const/routes';
import { Transition } from '@widgets';
import { useAppDispatch, useAppSelector } from '@shared/lib/redux/hooks';
import { selectClient } from '@entities/client/model';
import { Client } from '@entities/client';
import { ClientAPI } from '@shared/lib/api';

const ClientsPage = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const selectedClient = useAppSelector((state: RootState) => state.selectedClient);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const params = useParams();

  const getClients = () => {
    ClientAPI.getClients().then((res) => {
      setClients(res.data);

      const client = selectedClient.id
        ? selectedClient
        : res.data.find((client) => client.id === (+params.clientId! || res.data[0].id));

      if (!selectedClient.id) {
        if (client) {
          dispatch(selectClient(client));
        } else {
          dispatch(selectClient(res.data[0]));
        }
      }

      navigate(`${ROUTES.TARGET.Clients}/${client ? client.id : res.data[0].id}`);
    });
  };

  const handleClientChange = (e: ListBoxChangeEvent) => {
    if (e.value) {
      dispatch(selectClient(e.value));
      navigate(`${ROUTES.TARGET.Clients}/${e.value.id}`);
    }
  };

  useEffect(() => {
    getClients();
  }, []);

  return (
    <>
      <Helmet>
        <title>Projects</title>
      </Helmet>
      <Transition className={css.container}>
        <ListBox
          value={selectedClient}
          listStyle={{ height: 'calc(100 %- 47px)' }}
          filter
          filterPlaceholder='Поиск'
          options={clients}
          optionLabel='name'
          onChange={handleClientChange}
        />
        <div className={css.container__child}>
          <Outlet />
        </div>
      </Transition>
    </>
  );
};

export default ClientsPage;
