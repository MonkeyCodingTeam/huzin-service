import { SearchOutlined } from '@ant-design/icons';
import { Grid, Input } from 'antd';
import { ChangeEvent, FC } from 'react';

const { useBreakpoint } = Grid;

interface Props {
  handleValueChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

export const SearchInput: FC<Props> = ({ handleValueChange }) => {
  const screens = useBreakpoint();
  return (
    <Input
      allowClear
      suffix={<SearchOutlined />}
      placeholder={'Поиск...'}
      onChange={handleValueChange}
      size={screens.xs ? 'small' : 'middle'}
    />
  );
};
