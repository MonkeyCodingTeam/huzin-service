import { ListBox, ListBoxChangeEvent } from 'primereact/listbox';
import { selectClient } from '@entities/client/model';
import { useAppDispatch, useAppSelector } from '@shared/lib/redux/hooks';
import { MouseEvent, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { ROUTES } from '@shared/const/routes';
import { ClientAPI } from '@shared/lib/api';
import css from './ClientSettings.module.scss';
import { Divider } from 'primereact/divider';
import { Link, Loader } from '@shared/ui';
import { Client } from '@entities/client';
import { ClientSettingsGroup } from '../../ClientSettingsGroup';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';
import { PrimeIcons } from 'primereact/api';
import { InputText } from 'primereact/inputtext';
import classNames from 'classnames';

export const ClientSettings = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const selectedClient = useAppSelector((state: RootState) => state.selectedClient);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const params = useParams<{ clientId: string }>();

  useEffect(() => {
    ClientAPI.getClients().then((res) => {
      setClients(res.data);

      const client = selectedClient.id
        ? selectedClient
        : res.data.find((client) => client.id === (+params.clientId! || res.data[0].id));

      if (client) {
        dispatch(selectClient(client));
      } else {
        dispatch(selectClient(res.data[0]));
      }
      navigate(`${ROUTES.TARGET.Settings}/client/${client ? client.id : res.data[0].id}`);
    });
  }, []);

  const handleClientChange = (e: ListBoxChangeEvent) => {
    if (e.value) {
      dispatch(selectClient(clients.find((client) => client.id === e.value)));
      navigate(`${ROUTES.TARGET.Settings}/client/${e.value}`);
    }
  };

  const copyTelegramCommand = (e: MouseEvent<HTMLButtonElement>) => {
    const command = `/register ${selectedClient.id}`;
    const { currentTarget } = e;
    currentTarget.classList.add('p-button-success');

    navigator.clipboard.writeText(command).then(() => {
      setTimeout(() => {
        currentTarget.classList.remove('p-button-success');
      }, 2000);
    });
  };

  const clientListTemplate = (data: Client) => {
    if (data.has_telegram) {
      return (
        <span>
          {data.name}{' '}
          <i
            title='Есть чат'
            className={PrimeIcons.TELEGRAM}
            style={{ color: 'var(--primary-color)' }}
          />
        </span>
      );
    }
    return data.name;
  };

  // @ts-ignore
  return (
    <div className={css.container}>
      <ListBox
        className={css.clientList}
        listStyle={{ height: 'calc(100% - 61px)' }}
        value={selectedClient.id}
        filter
        filterPlaceholder='Поиск'
        itemTemplate={clientListTemplate}
        options={clients}
        optionValue='id'
        optionLabel='name'
        onChange={handleClientChange}
      />

      <div className={css.settings}>
        <div className={css.settings__list}>
          {!selectedClient.id ? (
            <Loader />
          ) : (
            <>
              <p className={css.settings__title}>{selectedClient.name}</p>
              <Link href={`/client_report/${selectedClient.id}/${selectedClient.token}`}>
                <p>Ссылка на отчёт</p>
              </Link>
              <div>
                <Divider style={{ marginTop: 0 }} id='main' align='left'>
                  <a className={css.settings__list__anchor} href='#main'>
                    # Группы
                  </a>
                </Divider>
                <ClientSettingsGroup client={selectedClient} />
              </div>
              <Divider id='telegram' align='left'>
                <a href='#telegram' className={css.settings__list__anchor}>
                  # Telegram
                </a>
              </Divider>
              <div>
                <div className={css.telegramBlock}>
                  <span className={css.telegramBlock__label}>Регистрация клиента:</span>
                  <div className={classNames('p-inputgroup', css.telegramBlock__command)}>
                    <Button icon={PrimeIcons.COPY} size='small' onClick={copyTelegramCommand} />
                    <InputText readOnly value={`/register ${selectedClient.id}`} size='small' />
                  </div>
                  {selectedClient.has_telegram ? (
                    <Tag severity='success' value='Есть чат' />
                  ) : (
                    <Tag severity='danger' value='Нет чата' />
                  )}
                </div>
              </div>
            </>
          )}
        </div>
        <Divider layout='vertical' />
        <div className={css.settings__panel}>
          <a href='#main' className={css.settings__panel__anchor}>
            # Группы
          </a>
          <a href='#telegram' className={css.settings__panel__anchor}>
            # Telegram
          </a>
        </div>
      </div>
    </div>
  );
};
