import { Grid, Select } from 'antd';
import { FC } from 'react';
import { useGetUsersQuery } from '@entities/user';
import { setArrayToOptionsFormat } from '@shared/lib/setArrayToOptionsFormat';

const { useBreakpoint } = Grid;

interface Props {
  onSelect: (userId: number) => void;
}

export const BudgetCutsUserSelect: FC<Props> = ({ onSelect }) => {
  const screens = useBreakpoint();
  const { isLoading, isFetching, data = [] } = useGetUsersQuery(null);

  const handleValueChange = (value: number) => {
    onSelect(value);
  };

  const filterOption = (
    input: string,
    option: { label: string; value: number } | undefined,
  ): boolean => {
    if (!option) return false;
    return option.label.toLowerCase().includes(input.toLowerCase());
  };

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
      size={screens.xs ? 'small' : 'middle'}
    />
  );
};
