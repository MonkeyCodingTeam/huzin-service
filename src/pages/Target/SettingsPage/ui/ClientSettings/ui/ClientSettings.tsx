import { ListBox, ListBoxChangeEvent } from 'primereact/listbox';
import { Client, ClientAPI, selectClient } from '@entities/client';
import { useAppDispatch, useAppSelector } from '@shared/lib/redux/hooks';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { ROUTES } from '@app/providers/RouterProvider/const/routes';
import css from './ClientSettings.module.scss';
import { Divider } from 'primereact/divider';
import { Link, Loader } from '@shared/ui';
import { Tag } from 'primereact/tag';
import { PrimeIcons } from 'primereact/api';
import { InputText } from 'primereact/inputtext';
import classNames from 'classnames';
import { CopyToClipboardButton } from '@shared/ui/CopyToClipboardButton';
import { ClientSettingsGroup } from '@pages/Target/SettingsPage';

export const ClientSettings = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const selectedClient = useAppSelector((state: RootState) => state.selectedClient);
  const dispatch = useAppDispatch();
  const params = useParams<{ clientId: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    ClientAPI.getClients().then((res) => {
      setClients(res.data);
      if (!res.data.length) {
        return;
      }

      if (selectedClient.id) {
        return navigate(`${ROUTES.TARGET.Settings}/client/${selectedClient.id}`);
      }

      const { clientId = res.data[0].id } = params;
      const client = res.data.find((client) => client.id === +clientId) || res.data[0];

      dispatch(selectClient(client));
      navigate(`${ROUTES.TARGET.Settings}/client/${client.id}`);
    });
  }, []);

  useEffect(() => {
    navigate(`${ROUTES.TARGET.Settings}/client/${selectedClient.id}`);
  }, [selectedClient, navigate]);

  const handleClientChange = (e: ListBoxChangeEvent) => {
    {
      const client = clients.find((item) => item.id === e.value);
      if (client) {
        dispatch(selectClient(client));
      }
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

  return (
    <div className={css.container}>
      <ListBox
        className={css.clientList}
        listStyle={{ height: 'calc(100% - 58px)', overflow: 'auto' }}
        style={{ height: 'calc(100% - 10px)' }}
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
                <Divider style={{ marginTop: 0 }} id='group' align='left'>
                  <a className={css.settings__list__anchor} href='#group'>
                    # Группа
                  </a>
                </Divider>
                <ClientSettingsGroup client={selectedClient} />
              </div>
              <Divider id='telegram' align='left'>
                <a href='#telegram' className={css.settings__list_model_anchor}>
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
          <a href='#group' className={css.settings__panel__anchor}>
            # Группа
          </a>
          <a href='#telegram' className={css.settings__panel__anchor}>
            # Telegram
          </a>
        </div>
      </div>
    </div>
  );
};
