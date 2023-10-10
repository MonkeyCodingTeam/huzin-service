import { StarFilled, StarTwoTone } from '@ant-design/icons';
import { Button } from 'antd';
import { FC, useEffect, useState } from 'react';
import { Client } from '@entities/client';
import { User } from '@entities/user';
import { useToggleWatcherMutation } from '@features/budgetCuts';

interface Props {
  client: Client;
  user: User;
}

export const WatchButton: FC<Props> = ({ client, user }) => {
  const [toggle, { isLoading }] = useToggleWatcherMutation();
  const [isMine, setIsMine] = useState(client.is_mine);

  const handleWatch = (client: Client, user: User) => {
    if (isLoading) return;
    setIsMine(!isMine);
    toggle({ clientId: client.id, user });
  };

  useEffect(() => {
    setIsMine(client.is_mine);
  }, [client.is_mine]);

  return (
    <Button
      title={isMine ? 'Перестать отслеживать' : 'Отслеживать'}
      type='text'
      size='small'
      shape='circle'
      onClick={() => handleWatch(client, user)}
      icon={
        isMine ? (
          <StarFilled style={{ color: '#1677ff' }} />
        ) : (
          <StarTwoTone twoToneColor={'#1677ff'} />
        )
      }
    ></Button>
  );
};
