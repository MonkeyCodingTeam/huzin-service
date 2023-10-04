import { Grid, Select } from 'antd';
import { FC, useEffect, useState } from 'react';
import { useGetUsersQuery } from '@entities/user';
import { setArrayToOptionsFormat } from '@shared/lib/setArrayToOptionsFormat';

const { useBreakpoint } = Grid;

interface Props {
  onSelect: (userId: number | undefined) => void;
}

export const BudgetCutsUserSelect: FC<Props> = ({ onSelect }) => {
  const screens = useBreakpoint();
  const { isLoading, isFetching, data = [] } = useGetUsersQuery(null);
  const [selectedValue, setSelectedValue] = useState<number | undefined>();

  const handleValueChange = (value: number | undefined) => {
    setSelectedValue(value);
  };

  const filterOption = (
    input: string,
    option: { label: string; value: number } | undefined,
  ): boolean => {
    if (!option) return false;
    return option.label.toLowerCase().includes(input.toLowerCase());
  };

  const setLocalUser = (userId: number | undefined) => {
    if (!userId) return localStorage.removeItem('selected-user');
    localStorage.setItem('selected-user', `${userId}`);
  };

  useEffect(() => {
    const localUser = localStorage.getItem('selected-user');
    if (localUser) setSelectedValue(+localUser);
  }, []);

  useEffect(() => {
    onSelect(selectedValue);
    setLocalUser(selectedValue);
  }, [selectedValue]);

  return (
    <Select
      style={{ width: '200px' }}
      allowClear
      showSearch
      loading={isLoading && isFetching}
      placeholder='Выберите сотрудника'
      optionFilterProp='children'
      options={setArrayToOptionsFormat(data, 'id', 'name')}
      onChange={(value) => handleValueChange(value)}
      filterOption={filterOption}
      value={selectedValue}
      size={screens.xs ? 'small' : 'middle'}
    />
  );
};
