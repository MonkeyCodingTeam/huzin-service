import { PlusOutlined } from '@ant-design/icons';
import { Button, ButtonProps } from 'antd';
import { FC } from 'react';

export const AddButton: FC<Omit<ButtonProps, 'children'>> = ({
  type = 'primary',
  style = { alignItems: 'center' },
  ...rest
}) => {
  return (
    <Button type={type} style={style} {...rest}>
      <PlusOutlined />
      Добавить
    </Button>
  );
};
