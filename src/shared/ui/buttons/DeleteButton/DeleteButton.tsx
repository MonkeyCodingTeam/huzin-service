import { DeleteOutlined, LoadingOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { Button, Popconfirm, PopconfirmProps } from 'antd';
import React, { FC } from 'react';

interface Props extends Omit<PopconfirmProps, 'children' | 'icon'> {
  isLoading?: boolean;
}

export const DeleteButton: FC<Props> = ({ isLoading = false, ...rest }) => {
  return (
    <Popconfirm {...rest} icon={<QuestionCircleOutlined style={{ color: 'red' }} />}>
      <Button danger style={{ height: 'auto', padding: '0 8px' }}>
        {isLoading ? <LoadingOutlined spin /> : <DeleteOutlined />}
      </Button>
    </Popconfirm>
  );
};
