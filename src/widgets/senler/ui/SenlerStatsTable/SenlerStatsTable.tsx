import { Grid, Table, Tag } from 'antd';
import { ColumnsType } from 'antd/es/table/interface';
import classNames from 'classnames';
import { FC, useCallback } from 'react';
import { SenlerStatsReq, SenlerStatsRes, useGetSenlerStatsQuery } from '@features/senlerStats';
import { setFixedValue } from '@shared/lib/setFixedValue';
import { truncValue } from '@shared/lib/truncValue';
import { SenlerIcon } from '@shared/ui/Icons/SenlerIcon';
import { Period } from '@widgets/senler';
import css from './SenlerStatsTable.module.scss';

const { useBreakpoint } = Grid;

interface Props {
  selectedPeriod: Period;
  clientSearch?: string;
}

export const SenlerStatsTable: FC<Props> = ({ selectedPeriod, clientSearch }) => {
  const screens = useBreakpoint();
  const requestBody: SenlerStatsReq = {
    date_from: selectedPeriod.date_from.startOf('day').format(),
    date_to: selectedPeriod.date_to.endOf('day').format(),
    period: 'day',
  };

  const filterData = useCallback(
    (data: SenlerStatsRes[] = [], search: string = '') =>
      data?.filter((item) => item.client_name.toLowerCase().includes(search.toLowerCase())) ?? [],
    [],
  );

  const { isLoading, filterByClient, isFetching } = useGetSenlerStatsQuery(requestBody, {
    selectFromResult: (res) => ({
      ...res,
      filterByClient: filterData(res.data, clientSearch),
    }),
  });

  const spentColorAlert = (value: number) => {
    if (!value) return '-';

    let color = 'red';
    if (value < 75) color = 'orange';
    if (value < 55) color = 'green';

    return (
      <Tag color={color} style={{ fontWeight: 600 }}>
        {value}
      </Tag>
    );
  };

  const columns: ColumnsType<SenlerStatsRes> = [
    {
      title: '',
      fixed: 'left',
      defaultSortOrder: 'ascend',
      dataIndex: 'success',
      sorter: {
        compare: ({ success: a }, { success: b }) => (a === b ? 0 : a ? -1 : 1),
        multiple: 2,
      },
      render: (record) => (
        <div title={record ? 'Senler подключен' : 'Senler не подключен'}>
          <SenlerIcon
            className={classNames(
              css.senlerStatsTable__cellIcon,
              css.senlerStatsTable__cellIcon_success,
              { [css.senlerStatsTable__cellIcon_error]: !record },
            )}
          />
        </div>
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
      dataIndex: 'count_subscribe',
      sorter: {
        compare: (a, b) => +a.count_subscribe - +b.count_subscribe,
        multiple: 1,
      },
    },
    {
      title: 'Цена подписки',
      dataIndex: 'costPerSub',
      sorter: { compare: (a, b) => +a.costPerSub - +b.costPerSub, multiple: 1 },
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
      rowKey='client_id'
      loading={isLoading || isFetching}
      dataSource={filterByClient}
      columns={columns}
      size={screens.xs ? 'small' : 'middle'}
      pagination={false}
      showSorterTooltip={false}
    />
  );
};
