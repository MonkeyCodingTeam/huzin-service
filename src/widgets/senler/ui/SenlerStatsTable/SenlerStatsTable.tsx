import type { TableProps } from 'antd';
import { Grid, Table, Tag, Tooltip } from 'antd';
import type { ColumnsType, FilterValue } from 'antd/es/table/interface';
import classNames from 'classnames';
import { FC, useEffect, useState } from 'react';
import { useLazyGetClientsQuery } from '@entities/client';
import { IClientsStatsReq, useLazyGetClientsStatsQuery } from '@features/clientStats';
import { useLazyGetSenlerStatsQuery } from '@features/senlerStats';
import { setFixedValue } from '@shared/lib/setFixedValue';
import { truncValue } from '@shared/lib/truncValue';
import { SenlerIcon } from '@shared/ui/Icons/SenlerIcon';
import { Period, TableData } from '@widgets/senler';
import { setTableData } from '@widgets/senler/lib/setTableData';
import css from './SenlerStatsTable.module.scss';

const { useBreakpoint } = Grid;

interface Props {
  selectedPeriod: Period;
  keyword?: string;
}

export const SenlerStatsTable: FC<Props> = ({ selectedPeriod, keyword }) => {
  const [filteredInfo, setFilteredInfo] = useState<Record<string, FilterValue | null>>({});

  const handleChange: TableProps<TableData>['onChange'] = (pagination, filters, sorter) => {
    console.log('Various parameters', pagination, filters, sorter);
    setFilteredInfo(filters);
  };

  const screens = useBreakpoint();
  const { date_from, date_to } = selectedPeriod;

  const datePeriod = {
    date_from: date_from.startOf('day').format(),
    date_to: date_to.endOf('day').format(),
  };

  const params: IClientsStatsReq = {
    period: 'day',
    ...datePeriod,
  };

  const [triggerSenler, senler] = useLazyGetSenlerStatsQuery();
  const [triggerStats, stats] = useLazyGetClientsStatsQuery();
  const [triggerClients, clients] = useLazyGetClientsQuery();

  const {
    isLoading: clientsStatsIsLoading,
    isFetching: clientsStatsIsFetching,
    data: senlerStats = [],
  } = senler;
  const {
    isLoading: senlerStatsIsLoading,
    isFetching: senlerStatsIsFetching,
    data: clientsStats = [],
  } = stats;
  const {
    isLoading: clientsIsLoading,
    isFetching: clientsIsFetching,
    data: clientsData = [],
  } = clients;

  const tableData = setTableData(clientsStats, senlerStats, clientsData);

  const isLoading =
    clientsStatsIsLoading ||
    clientsStatsIsFetching ||
    senlerStatsIsLoading ||
    senlerStatsIsFetching ||
    clientsIsLoading ||
    clientsIsFetching;

  useEffect(() => {
    triggerStats(params);
    triggerSenler(datePeriod);
    triggerClients(null);
  }, [selectedPeriod]);

  const spentColorAlert = (value: number) => {
    if (value) {
      if (value > 75) {
        return (
          <Tag color='red' style={{ fontWeight: 600 }}>
            {value}
          </Tag>
        );
      }
      if (value > 55) {
        return (
          <Tag color='orange' style={{ fontWeight: 600 }}>
            {value}
          </Tag>
        );
      }
      return (
        <Tag color='green' style={{ fontWeight: 600 }}>
          {value}
        </Tag>
      );
    }
    return '-';
  };

  const columns: ColumnsType<TableData> = [
    {
      title: '',
      dataIndex: 'success',
      fixed: 'left',
      sorter: { compare: (a, b) => Number(a.success) - Number(b.success), multiple: 2 },
      defaultSortOrder: 'descend',
      render: (value) => (
        <Tooltip placement='top' title={value ? 'Senler подключен' : 'Senler не подключен'}>
          <SenlerIcon
            className={classNames(
              css.senlerStatsTable__cellIcon,
              css.senlerStatsTable__cellIcon_success,
              { [css.senlerStatsTable__cellIcon_error]: !value },
            )}
          />
        </Tooltip>
      ),
      align: 'center',
      width: 40,
    },
    {
      title: 'Клиенты',
      dataIndex: 'client_name',
      fixed: 'left',
    },
    {
      title: 'Потрачено',
      dataIndex: 'spent',
      sorter: { compare: (a, b) => +a.spent - +b.spent, multiple: 1 },
      render: (value) => truncValue(+value),
    },
    {
      title: 'Подписчики',
      dataIndex: 'subscribers',
      sorter: { compare: (a, b) => +a.subscribers - +b.subscribers, multiple: 1 },
    },
    {
      title: 'Цена подписки',
      dataIndex: 'spentPerSub',
      sorter: { compare: (a, b) => +a.spentPerSub - +b.spentPerSub, multiple: 1 },
      render: (value) => spentColorAlert(+setFixedValue(+value, 2)),
    },
  ];

  return (
    <Table
      scroll={{
        x: 1000,
        y: screens.lg
          ? 'calc(100vh - 18em)'
          : screens.xs
          ? 'calc(100vh - 16em)'
          : 'calc(100vh - 14em)',
      }}
      rowKey='id'
      loading={isLoading}
      dataSource={tableData}
      columns={columns}
      size={screens.xs ? 'small' : 'middle'}
      pagination={false}
      showSorterTooltip={false}
      onChange={handleChange}
    />
  );
};
