import { Grid, Table, Tag, Tooltip } from 'antd';
import type { ColumnsType } from 'antd/es/table/interface';
import classNames from 'classnames';
import { FC, useEffect, useState } from 'react';
import { useGetClientsQuery } from '@entities/client';
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
  clientSearch?: string;
}

export const SenlerStatsTable: FC<Props> = ({ selectedPeriod, clientSearch }) => {
  const [filteredData, setFilteredData] = useState<TableData[]>([]);
  const [triggerSenler, { isLoading: clientsStatsIsLoading, data: senlerStats = [] }] =
    useLazyGetSenlerStatsQuery();
  const [triggerStats, { isLoading: senlerStatsIsLoading, data: clientsStats = [] }] =
    useLazyGetClientsStatsQuery();
  const { isLoading: isClientLoading, data: clientsData = [] } = useGetClientsQuery(null);
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

  const tableData = setTableData(clientsStats, senlerStats, clientsData);

  const isLoading = clientsStatsIsLoading || senlerStatsIsLoading || isClientLoading;

  useEffect(() => {    
    triggerStats(params);
    triggerSenler(datePeriod);
  }, [selectedPeriod]);

  useEffect(() => {
    const copyData = [...tableData];

    setFilteredData(() => {
      if (!clientSearch || !clientSearch.length) return copyData;

      return copyData.filter((data) => {
        return data.client_name.toLocaleLowerCase().includes(clientSearch.toLocaleLowerCase());
      });
    });
  }, [clientSearch, tableData]);

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
      dataSource={filteredData}
      columns={columns}
      size={screens.xs ? 'small' : 'middle'}
      pagination={false}
      showSorterTooltip={false}
    />
  );
};
