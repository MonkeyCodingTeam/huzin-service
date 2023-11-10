import { Divider, Grid, Table, Tooltip } from 'antd';
import { ColumnsType } from 'antd/es/table/interface';
import { FC } from 'react';
import { setCostPerClick, StatsRes, transformDateByFormat } from '@entities/client';
import { roundValue } from '@shared/lib/roundValue';

const { useBreakpoint } = Grid;

interface Props {
  dataTable: StatsRes[];
  isLoading: boolean;
  dividerText?: string;
}

export const GuestStatsTable: FC<Props> = ({ dataTable, isLoading, dividerText }) => {
  const screens = useBreakpoint();

  const columns: ColumnsType<StatsRes> = [
    {
      title: 'Дата',
      dataIndex: 'period_date',
      sorter: (a, b) => {
        const aPeriod = a.period_date.replace(/-/g, '');
        const bPeriod = b.period_date.replace(/-/g, '');
        return +aPeriod - +bPeriod;
      },
      defaultSortOrder: 'descend',
      render: (value) => (value ? transformDateByFormat(value) : value),
      fixed: 'left',
    },
    {
      title: 'Расход',
      dataIndex: 'spent',
      sorter: (a, b) => +a.spent - +b.spent,
      render: (value) => (value ? roundValue(+value) : '-'),
    },
    {
      title: 'Клики',
      dataIndex: 'clicks',
      sorter: (a, b) => +a.clicks - +b.clicks,
      render: (value) => (value ? roundValue(+value) : '-'),
    },
    {
      title: 'Цена клика',
      sorter: (a, b) => +setCostPerClick(a) - +setCostPerClick(b),
      render: (stats) => setCostPerClick(stats) || '-',
    },
    {
      title: 'Охват',
      dataIndex: 'reach',
      sorter: (a, b) => +a.reach - +b.reach,
      render: (value) => (value ? roundValue(+value) : '-'),
    },
    {
      title: 'Просмотры',
      dataIndex: 'impressions',
      sorter: (a, b) => +a.impressions - +b.impressions,
      render: (value) => (value ? roundValue(+value) : '-'),
    },
    {
      title: <Tooltip title={'Коэффициент кликабельности'}>CTR</Tooltip>,
      dataIndex: 'ctr',
    },
  ];

  return (
    <>
      {dividerText && <Divider orientation='left'>{dividerText}</Divider>}
      <Table
        // ширина таблицы
        scroll={{
          x: screens.lg ? 1024 : screens.xs ? 612 : 768,
          // y: screens.lg
          //   ? 'calc(100vh - 18em)'
          //   : screens.xs
          //   ? 'calc(100vh - 13em)'
          //   : 'calc(100vh - 14em)',
        }}
        rowKey={'period_date'}
        loading={isLoading}
        dataSource={dataTable}
        columns={columns}
        size={screens.xs ? 'small' : 'middle'}
        pagination={false}
        showSorterTooltip={false}
      />
    </>
  );
};
