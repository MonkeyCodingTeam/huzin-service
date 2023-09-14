import { Select } from 'antd';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router';
import { setSelectedClient, useGetClientsQuery } from '@entities/client';
import { TARGET_ROUTES } from '@shared/const';
import { setArrayToOptionsFormat } from '@shared/lib/setArrayToOptionsFormat';
import css from './ClientSelect.module.scss';

export const ClientSelect = () => {
  const params = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [selectedValue, setSelectedValue] = useState<number | null>();
  const selectedClientId = useSelector((state: RootState) => state.selectedClient.id);
  const { isLoading, data = [], isFetching } = useGetClientsQuery(null);

  const handleValueChange = (value: number) => {
    setSelectedValue(value);
  };
  const checkId = (id: number): boolean => {
    return data.some((client) => client.id === id);
  };

  useEffect(() => {
    if (!isFetching && !selectedClientId && !params.id) {
      return setSelectedValue(data[0].id);
    }
    if (!isFetching && !selectedClientId && params.id) {
      return checkId(+params.id) ? setSelectedValue(+params.id) : setSelectedValue(null);
    }
    if (selectedClientId) {
      return setSelectedValue(selectedClientId);
    }
  }, [data]);

  useEffect(() => {
    if (selectedValue) {
      dispatch(setSelectedClient(data.find((client) => client.id === selectedValue)));
      navigate(`${TARGET_ROUTES.BaseClientStats}/${selectedValue}`);
    }
  }, [selectedValue]);

  return (
    <Select
      className={css.clientsSelect}
      showSearch
      loading={isLoading && isFetching}
      placeholder='Выберите клиента'
      optionFilterProp='children'
      options={setArrayToOptionsFormat(data, 'id', 'name')}
      onChange={(value) => handleValueChange(value)}
      value={selectedValue}
      filterOption={(input, option): boolean => {
        if (!option) return false;
        return option.label.toLowerCase().includes(input.toLowerCase());
      }}
    />
  );
};
