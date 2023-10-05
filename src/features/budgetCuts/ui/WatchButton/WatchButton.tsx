import { StarFilled, StarTwoTone } from '@ant-design/icons';
import { Button, Tooltip } from 'antd';
import { FC } from 'react';
import { Client } from '@entities/client';
import { User } from '@entities/user';
import { useAppSelector } from '@shared/lib';

interface Props {
  handleWatch: (record: Client, user: User) => void;
  record: Client;
}

export const WatchButton: FC<Props> = ({ handleWatch, record }) => {
  const user = useAppSelector((state) => state.user);
  return (
    <Tooltip title={record.is_mine ? 'Перестать отслеживать' : 'Отслеживать'}>
      <Button type='text' size='small' shape='circle' onClick={() => handleWatch(record, user)}>
        {record.is_mine ? (
          <StarFilled style={{ color: '#1677ff' }} />
        ) : (
          <StarTwoTone twoToneColor={'#1677ff'} />
        )}
      </Button>
    </Tooltip>
  );
};
