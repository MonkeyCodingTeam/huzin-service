import { Grid, Table, Tag, Tooltip } from 'antd';
import { ColumnsType } from 'antd/es/table/interface';
import classNames from 'classnames';
import { FC, useEffect, useState } from 'react';
import { SenlerStatsReq, SenlerStatsRes, useLazyGetSenlerStatsQuery } from '@features/senlerStats';
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
  const [filteredData, setFilteredData] = useState<SenlerStatsRes[]>([]);
  const [period, setPeriod] = useState<SenlerStatsReq>();
  const [triggerSenler, { isLoading, isFetching, data = [] }] = useLazyGetSenlerStatsQuery();

  const screens = useBreakpoint();

  useEffect(() => {
    if (!selectedPeriod) return;
    setPeriod({
      date_from: selectedPeriod.date_from.startOf('day').format(),
      date_to: selectedPeriod.date_to.endOf('day').format(),
      period: 'day',
    });
  }, [selectedPeriod]);

  useEffect(() => {
    if (period) triggerSenler(period);
  }, [period]);

  useEffect(() => {
    const copyData = [...data];

    setFilteredData(() => {
      if (!clientSearch || !clientSearch.length) return copyData;

      return copyData.filter((data) => {
        return data.client_name.toLowerCase().includes(clientSearch.toLowerCase());
      });
    });
  }, [clientSearch, data.length]);

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

  const columns: ColumnsType<SenlerStatsRes> = [
    {
      title: '',
      fixed: 'left',
      defaultSortOrder: 'descend',
      dataIndex: 'success',
      sorter: { compare: (a, b) => Number(a.success) - Number(b.success), multiple: 2 },
      render: (record) => (
        <Tooltip placement='top' title={record ? 'Senler подключен' : 'Senler не подключен'}>
          <SenlerIcon
            className={classNames(
              css.senlerStatsTable__cellIcon,
              css.senlerStatsTable__cellIcon_success,
              { [css.senlerStatsTable__cellIcon_error]: !record },
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
      dataSource={filteredData}
      columns={columns}
      size={screens.xs ? 'small' : 'middle'}
      pagination={false}
      showSorterTooltip={false}
    />
  );
};
