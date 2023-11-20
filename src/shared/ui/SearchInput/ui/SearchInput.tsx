import { SearchOutlined } from '@ant-design/icons';
import { Grid, Input } from 'antd';
import { ChangeEvent, FC } from 'react';

const { useBreakpoint } = Grid;

interface Props {
  handleValueChange: (event: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}

export const SearchInput: FC<Props> = ({ handleValueChange, placeholder = 'Поиск...' }) => {
  const screens = useBreakpoint();
  return (
    <Input
      allowClear
      suffix={<SearchOutlined />}
      placeholder={placeholder}
      onChange={handleValueChange}
      style={{ width: '100%' }}
      size={screens.xs ? 'small' : 'middle'}
    />
  );
};
