import { Table } from 'antd';
import type { ColumnsType } from 'antd/es/table/interface';
import { DateTime } from 'luxon';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { IStatsReq, IStatsResp, useLazyGetClientStatsQuery } from '@entities/client';
import { sumStatsForPeriod } from '@widgets/client/lib/sumStatsForPeriod';
import css from './ClientsStatsTable.module.scss';

const semiAnnualReport: IStatsReq = {
  id: 0,
  period: 'week',
  date_from: DateTime.now().minus({ month: 5 }).toISODate(),
  date_to: DateTime.now().toISODate(),
};

export const ClientStatsTable = () => {
  const selectedClientId = useSelector((state: RootState) => state.selectedClient.id);
  const [trigger, result] = useLazyGetClientStatsQuery();
  const { isLoading, isFetching, data = [] } = result;
  const truncValue = (value: number) => `${value ? Math.trunc(value).toLocaleString() : '-'}`;
  const toFixedValue = (value: number) => `${value ? +value.toFixed(1).toLocaleString() : '-'}`;
  const toDateFormat = (value: string) =>
    `${DateTime.fromFormat(value, 'yyyy-MM-dd').toFormat('dd.MM.yyyy')}`;

  useEffect(() => {
    if (selectedClientId) {
      trigger({ ...semiAnnualReport, id: selectedClientId });
    }
  }, [selectedClientId]);

  const dataSource = sumStatsForPeriod(data);
  const columns: ColumnsType<IStatsResp> = [
    {
      title: 'Дата',
      dataIndex: 'period_date',
      sorter: (a, b) => +a.day_from - +b.day_from,
      defaultSortOrder: 'descend',
      render: (value) => toDateFormat(value),
      fixed: 'left',
    },
    {
      title: 'Расход',
      dataIndex: 'spent',
      sorter: (a, b) => +a.spent - +b.spent,
      render: (value) => truncValue(value),
    },
    {
      title: 'Клики',
      dataIndex: 'clicks',
      sorter: (a, b) => +a.clicks - +b.clicks,
      render: (value) => truncValue(value),
    },
    {
      title: 'Охват',
      dataIndex: 'impressions',
      sorter: (a, b) => +a.impressions - +b.impressions,
      render: (value) => truncValue(value),
    },
    {
      title: 'CTR',
      dataIndex: 'ctr',
    },
    {
      title: 'CPC',
      dataIndex: 'effective_cost_per_click',
      render: (value) => toFixedValue(+value),
    },
    {
      title: 'CPM',
      dataIndex: 'effective_cost_per_mille',
      render: (value) => toFixedValue(+value),
    },
  ];

  return (
    <Table
      scroll={{ x: 658, y: 768 }}
      className={css.clientsStats_table}
      rowKey='day_from'
      loading={isLoading || isFetching}
      dataSource={dataSource}
      columns={columns}
      size='middle'
      pagination={false}
      showSorterTooltip={false}
    />
  );
};
