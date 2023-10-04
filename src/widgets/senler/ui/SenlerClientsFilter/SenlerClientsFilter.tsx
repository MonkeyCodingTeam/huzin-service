import { SearchOutlined } from '@ant-design/icons';
import { Grid, Input } from 'antd';
import { ChangeEvent, FC } from 'react';

const { useBreakpoint } = Grid;

interface Props {
  handleValueChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

export const SenlerClientsFilter: FC<Props> = ({ handleValueChange }) => {
  const screens = useBreakpoint();
  return (
    <Input
      suffix={<SearchOutlined />}
      placeholder={'Поиск...'}
      onChange={handleValueChange}
      size={screens.xs ? 'small' : 'middle'}
    />
  );
};
