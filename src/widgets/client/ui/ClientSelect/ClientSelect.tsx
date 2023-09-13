import { Select } from 'antd';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedClient, useGetClientsQuery } from '@entities/client';
import { setArrayToOptionsFormat } from '@shared/lib/setArrayToOptionsFormat';
import css from './ClientSelect.module.scss';

export const ClientSelect = () => {
  const dispatch = useDispatch();
  const [selectedValue, setSelectedValue] = useState<number>();
  const selectedClientId = useSelector((state: RootState) => state.selectedClient.id);
  const { isLoading, data = [], isFetching } = useGetClientsQuery(null);

  const handleChange = (value: number) => {
    setSelectedValue(value);
    dispatch(setSelectedClient(data.find((client) => client.id === value)));
  };

  useEffect(() => {
    if (data.length && !selectedClientId) {
      setSelectedValue(data[0].id);
      dispatch(setSelectedClient(data[0]));
    }
    if (selectedClientId) {
      setSelectedValue(selectedClientId);
    }
  }, [data, selectedClientId]);

  return (
    <Select
      className={css.clients_select}
      showSearch
      loading={isLoading && isFetching}
      placeholder='Клиенты'
      optionFilterProp='children'
      options={setArrayToOptionsFormat(data, 'id', 'name')}
      onChange={(value) => handleChange(value)}
      value={selectedValue}
      filterOption={(input, option): boolean => {
        if (!option) return false;
        return option.label.toLowerCase().includes(input.toLowerCase());
      }}
    />
  );
};
