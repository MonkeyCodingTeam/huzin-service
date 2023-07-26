import { ListBox, ListBoxChangeEvent } from 'primereact/listbox';
import { selectClient } from '@entities/client/model';
import { useAppDispatch, useAppSelector } from '@shared/lib/redux/hooks';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import css from './ClientSettings.module.scss';
import { Divider } from 'primereact/divider';
import { Link, Loader } from '@shared/ui';
import { Client, ClientAPI } from '@entities/client';
import { ClientSettingsGroup } from '../../ClientSettingsGroup';
import { Tag } from 'primereact/tag';
import { PrimeIcons } from 'primereact/api';
import { InputText } from 'primereact/inputtext';
import classNames from 'classnames';
import { CopyToClipboardButton } from '@shared/ui/CopyToClipboardButton';
import { ROUTES } from '@app/providers/RouterProvider';

export const ClientSettings = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const selectedClient = useAppSelector((state: RootState) => state.selectedClient);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const params = useParams<{ clientId: string }>();

  useEffect(() => {
    ClientAPI.getClients().then((res) => {
      setClients(res.data);
      if (!res.data.length) {
        return;
      }

      const { clientId } = params;

      if (clientId) {
        const client = res.data.find((client) => client.id === +clientId) || res.data[0];
        dispatch(selectClient(client));
        return navigate(`${ROUTES.TARGET.Settings}/client/${client.id}`);
      }

      if (selectedClient.id) {
        return navigate(`${ROUTES.TARGET.Settings}/client/${selectedClient.id}`);
      }

      dispatch(selectClient(res.data[0]));
      return navigate(`${ROUTES.TARGET.Settings}/client/${res.data[0].id}`);
    });
  }, []);

  const handleClientChange = (e: ListBoxChangeEvent) => {
    if (e.value) {
      dispatch(selectClient(clients.find((client) => client.id === e.value)));
      navigate(`${ROUTES.TARGET.Settings}/client/${e.value}`);
    }
  };

  const clientListTemplate = (data: Client) => {
    return (
      <div className={css.clientList__item}>
        {hasGroup(data)}
        <span>{data.name}</span>
        {hasTelegram(data)}
      </div>
    );
  };

  const hasTelegram = (cleint: Client) => {
    if (!cleint.has_telegram) {
      return;
    }

    return (
      <i
        title='Есть чат'
        className={PrimeIcons.TELEGRAM}
        style={{ color: 'var(--primary-color)' }}
      />
    );
  };

  const hasGroup = (cleint: Client) => {
    if (cleint.group_id) {
      return;
    }

    return (
      <i
        title='Нет группы'
        className={PrimeIcons.EXCLAMATION_TRIANGLE}
        style={{ color: 'var(--warning-color)' }}
      />
    );
  };

  // @ts-ignore
  return (
    <div className={css.container}>
      <ListBox
        className={css.clientList}
        listStyle={{ height: 'calc(100% - 48px)' }}
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
                  <div className={classNames('p-inputgroup', css.telegramBlock__command)}>
                    <span className='p-inputgroup-addon'>Telegram бот:</span>
                    <InputText readOnly value={__TELEGRAM_BOT__} />
                    <CopyToClipboardButton text={__TELEGRAM_BOT__} />
                  </div>
                  <div className={classNames('p-inputgroup', css.telegramBlock__command)}>
                    <span className='p-inputgroup-addon'>Регистрация клиента:</span>
                    <InputText readOnly value={`/register ${selectedClient.id}`} />
                    <CopyToClipboardButton text={`/register ${selectedClient.id}`} />
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
