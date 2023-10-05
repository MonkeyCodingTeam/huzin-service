import { EditTwoTone } from '@ant-design/icons';
import { Button, Tooltip } from 'antd';
import { FC } from 'react';
import { Client } from '@entities/client';

interface Props {
  handleEdit: (record: Client) => void;
  record: Client;
}

export const EditButton: FC<Props> = ({ handleEdit, record }) => {
  return (
    <Tooltip title={'Редактировать'}>
      <Button type='text' onClick={() => handleEdit(record)} size='small' shape='circle'>
        <EditTwoTone twoToneColor={'#1677ff'} />
      </Button>
    </Tooltip>
  );
};
