import { SearchOutlined } from '@ant-design/icons';
import { Input } from 'antd';
import { ChangeEvent, FC, useEffect, useState } from 'react';

interface Props {
  handleValueChange: (value: string) => void;
}

export const SenlerClientsFilter: FC<Props> = ({ handleValueChange }) => {
  const [value, setValue] = useState<string>('');
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };

  useEffect(() => {
    handleValueChange(value);
  }, [value]);

  return (
    <Input
      suffix={<SearchOutlined />}
      placeholder={'Поиск...'}
      value={value}
      onChange={handleChange}
    />
  );
};
