import { Badge, Grid, Select, Typography } from 'antd';
import classNames from 'classnames';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { Client, setSelectedClient, useGetClientsQuery } from '@entities/client';
import css from './ClientSelect.module.scss';

const { useBreakpoint } = Grid;
const { Text } = Typography;
const { Option } = Select;

export const ClientSelect = () => {
  const params = useParams();
  const dispatch = useDispatch();
  const screens = useBreakpoint();

  const [selectedValue, setSelectedValue] = useState<number | null>();
  const selectedClientId = useSelector((state: RootState) => state.selectedClient.id);
  const { isLoading, data = [], isFetching } = useGetClientsQuery(null);

  const handleValueChange = (value: number) => {
    setSelectedValue(value);
  };

  const checkId = (id: number): boolean => {
    return data.some((client) => client.id === id);
  };

  const filterOption = (
    input: string,
    option: { label: string; value: number } | undefined,
  ): boolean => {
    if (!option) return false;
    return option.label.toLowerCase().includes(input.toLowerCase());
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
    }
  }, [selectedValue]);

  const setOptions = (values: Client[]) => {
    if (!values.length) return;
    return values.map((client) => {
      // Указываются условия через ||
      const haveCriticalError = !client.group_id;
      const haveError = !client.has_telegram;

      return (
        <Option value={client.id} label={client.name} key={client.id}>
          {(haveCriticalError || haveError) && (
            <Badge status={haveCriticalError ? 'error' : 'warning'} />
          )}
          <Text
            title={client.name}
            className={classNames(css.clientsSelect__text, {
              [css.clientsSelect__text_badged]: haveCriticalError || haveError,
            })}
          >
            {client.name}
          </Text>
        </Option>
      );
    });
  };

  return (
    <Select
      className={css.clientsSelect}
      showSearch
      loading={isLoading && isFetching}
      placeholder='Выберите клиента'
      optionFilterProp='children'
      onChange={(value) => handleValueChange(value)}
      filterOption={filterOption}
      size={screens.xs ? 'small' : 'middle'}
      value={selectedValue}
      optionLabelProp='label'
    >
      {setOptions(data)}
    </Select>
  );
};
