import { EditTwoTone } from '@ant-design/icons';
import { Button } from 'antd';
import { FC } from 'react';
import { Client } from '@entities/client';

interface Props {
  handleEdit: (record: Client) => void;
  client: Client;
}

export const EditButton: FC<Props> = ({ handleEdit, client }) => {
  return (
    <Button
      title={'Редактировать'}
      type='text'
      onClick={() => handleEdit(client)}
      size='small'
      shape='circle'
    >
      <EditTwoTone twoToneColor={'#1677ff'} />
    </Button>
  );
};
