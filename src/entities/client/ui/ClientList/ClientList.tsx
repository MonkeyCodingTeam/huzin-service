import { ChangeEvent, FC, useCallback, useEffect, useState } from 'react';
import { Client, selectClient } from '@entities/client';
import { Input, List, Space } from 'antd';
import css from './ClientList.module.scss';
import { useAppDispatch, useAppSelector } from '@shared/lib/redux';
import classNames from 'classnames';

interface Props {
  withSearch?: boolean;
  clients: Client[];
}

export const ClientList: FC<Props> = ({ clients, withSearch = true }) => {
  const [clientsList, setClientsList] = useState<Client[]>([]);
  const selectedClient = useAppSelector((state: RootState) => state.selectedClient);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(selectClient(clients[0]));
  }, []);

  useEffect(() => {
    setClientsList(clients);
  }, [clients]);

  const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
    const searchValue = event.currentTarget.value;

    setClientsList(() => {
      if (!searchValue) return clients;
      console.log('seatch');

      return clients.filter((client) => {
        const regex = new RegExp(searchValue, 'ui');
        const nameMatch = client.name.match(regex);
        const idMatch = client.id.toString().startsWith(searchValue);

        return nameMatch || idMatch;
      });
    });
  };

  const handleClick = useCallback(
    (client: Client) => {
      dispatch(selectClient(client));
    },
    [clients],
  );

  return (
    <Space direction='vertical' className={css.container}>
      <Input
        hidden={!withSearch}
        className={css.container__list}
        placeholder='Поиск'
        onChange={handleSearch}
      />
      <List
        size='small'
        dataSource={clientsList}
        renderItem={(item) => (
          <List.Item
            onClick={() => handleClick(item)}
            className={classNames(css.container__list__item, {
              [css.container__list__item_active]: selectedClient.id === item.id,
            })}
          >
            {item.name}
          </List.Item>
        )}
      />
    </Space>
  );
};
