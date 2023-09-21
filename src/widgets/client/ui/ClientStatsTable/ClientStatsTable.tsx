import { Grid, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table/interface';
import dayjs from 'dayjs';
import { DateTime } from 'luxon';
import { FC, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { ClientStatsReq, StatsRes, useLazyGetClientStatsQuery } from '@features/clientStats';
import { setFixedValue } from '@shared/lib/setFixedValue';
import { truncValue } from '@shared/lib/truncValue';
import { sumStatsForPeriod } from '@widgets/client/lib/sumStatsForPeriod';

const { useBreakpoint } = Grid;

const semiAnnualReport: ClientStatsReq = {
  id: 0,
  period: 'week',
  date_from: dayjs().subtract(6, 'month').format(),
  date_to: dayjs().format(),
};

interface Props {
  selectedTemplate: number | null | undefined;
}

export const ClientStatsTable: FC<Props> = ({ selectedTemplate }) => {
  const screens = useBreakpoint();

  const selectedClientId = useSelector((state: RootState) => state.selectedClient.id);
  const [trigger, result] = useLazyGetClientStatsQuery();
  const { isLoading, isFetching, data = [] } = result;
  const dataSource = sumStatsForPeriod(data);

  const toDateFormat = (value: string) =>
    `${DateTime.fromFormat(value, 'yyyy-MM-dd').toFormat('dd.MM.yyyy')}`;

  useEffect(() => {
    if (selectedClientId) {
      trigger(
        {
          ...semiAnnualReport,
          id: selectedClientId,
          company_template_ids: selectedTemplate ? [selectedTemplate] : undefined,
        },
        true,
      );
    }
  }, [selectedClientId, selectedTemplate]);

  const columns: ColumnsType<StatsRes> = [
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
      render: (value) => truncValue(+value),
    },
    {
      title: 'Клики',
      dataIndex: 'clicks',
      sorter: (a, b) => +a.clicks - +b.clicks,
      render: (value) => truncValue(+value),
    },
    {
      title: 'Охват',
      dataIndex: 'impressions',
      sorter: (a, b) => +a.impressions - +b.impressions,
      render: (value) => truncValue(+value),
    },
    {
      title: 'CTR',
      dataIndex: 'ctr',
    },
    {
      title: 'CPC',
      dataIndex: 'effective_cost_per_click',
      render: (value) => setFixedValue(+value, 1),
    },
    {
      title: 'CPM',
      dataIndex: 'effective_cost_per_mille',
      render: (value) => setFixedValue(+value, 1),
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
      rowKey='day_from'
      loading={isLoading || isFetching}
      dataSource={dataSource}
      columns={columns}
      size={screens.xs ? 'small' : 'middle'}
      pagination={false}
      showSorterTooltip={false}
    />
  );
};
