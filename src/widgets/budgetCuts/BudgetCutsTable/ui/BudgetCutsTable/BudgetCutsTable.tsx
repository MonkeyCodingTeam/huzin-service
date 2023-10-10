import { WarningOutlined } from '@ant-design/icons';
import { Divider, Grid, Table, Tooltip, Typography } from 'antd';
import { ColumnsType } from 'antd/es/table/interface';
import classNames from 'classnames';
import { FC, useCallback } from 'react';
import { Client, useGetClientsQuery } from '@entities/client';
import { User } from '@entities/user';
import { EditButton, WatchButton } from '@features/budgetCuts';
import {
  balanceAlert,
  daySpentAlert,
  getDayPlan,
  getMonthdayPlan,
  getNecessaryAmount,
  getNecessaryExpenses,
  getWeekdayPlan,
  monthSpentAlert,
  weekSpentAlert,
} from '@widgets/budgetCuts';
import css from './BudgetCutsTable.module.scss';

const { useBreakpoint } = Grid;
const { Text } = Typography;

interface Props {
  clientSearch?: string;
  selectedUser?: number;
  handleEdit: (client: Client) => void;
  handleWatch: (client: Client, user: User) => void;
  isUpdating: boolean;
}

export const BudgetCutsTable: FC<Props> = ({
  clientSearch,
  selectedUser,
  handleEdit,
  handleWatch,
  isUpdating,
}) => {
  const screens = useBreakpoint();
  const filterData = useCallback((data: Client[] = [], search: string = '', userId: number = 0) => {
    let clientsData = userId
      ? data.filter((item) => item.users.find((user) => user.id === userId))
      : data;
    return clientsData.filter((item) => item.name.toLowerCase().includes(search.toLowerCase()));
  }, []);

  const {
    isLoading,
    isFetching,
    filteredData = [],
  } = useGetClientsQuery(null, {
    pollingInterval: 1000 * 60 * 5,
    selectFromResult: (res) => ({
      ...res,
      filteredData: filterData(res.data, clientSearch, selectedUser),
    }),
  });

  const columns: ColumnsType<Client> = [
    {
      shouldCellUpdate: (prevRecord, nextRecord) => prevRecord != nextRecord,
      width: 68,
      title: '',
      fixed: 'left',
      align: 'center',
      render: (record) => {
        return (
          <>
            <EditButton handleEdit={handleEdit} record={record} />
            <Divider type='vertical' style={{ margin: '2px' }} />
            <WatchButton handleWatch={handleWatch} record={record} />
          </>
        );
      },
    },
    {
      shouldCellUpdate: (prevRecord, nextRecord) => prevRecord.name != nextRecord.name,
      title: 'Клиенты',
      fixed: 'left',
      width: 200,
      dataIndex: 'name',
    },
    {
      shouldCellUpdate: (prevRecord, nextRecord) =>
        prevRecord.critical_balance != nextRecord.critical_balance,
      title: 'Баланс',
      width: 150,
      render: (record) => {
        return (
          <Text className={classNames(css.budgetCutsTable__amount, balanceAlert(record))}>
            {record.balance.toLocaleString()} / {record.critical_balance.toLocaleString()}
          </Text>
        );
      },
    },
    {
      title: 'Расходы',
      children: [
        {
          shouldCellUpdate: (prevRecord, nextRecord) =>
            prevRecord.zero_days != nextRecord.zero_days,
          title: (
            <Tooltip title='Дни без расходов'>
              <WarningOutlined style={{ fontSize: '16px' }} />
            </Tooltip>
          ),
          width: 60,
          dataIndex: 'zero_days',
          align: 'center',
          render: (value) => {
            if (!value) return <Text>-</Text>;
            return <Text className={css.budgetCutsTable__zeroDayWarn}>{value}</Text>;
          },
        },
        {
          shouldCellUpdate: (prevRecord, nextRecord) =>
            prevRecord.day_spent != nextRecord.day_spent,
          title: 'День',
          width: 120,
          render: (record) => {
            const dayPlan = getDayPlan(record);
            return (
              <Text className={classNames(css.budgetCutsTable__amount, daySpentAlert(record))}>
                {record.day_spent ? record.day_spent.toLocaleString() : 0} /{' '}
                {dayPlan.toLocaleString()}
              </Text>
            );
          },
        },
        {
          shouldCellUpdate: (prevRecord, nextRecord) =>
            prevRecord.week_spent != nextRecord.week_spent,
          title: 'Неделя',
          width: 120,
          render: (record) => {
            const weekdayPlan = getWeekdayPlan(record);
            return (
              <Text className={classNames(css.budgetCutsTable__amount, weekSpentAlert(record))}>
                {record.week_spent ? record.week_spent.toLocaleString() : 0} /{' '}
                {weekdayPlan.toLocaleString()}
              </Text>
            );
          },
        },
        {
          shouldCellUpdate: (prevRecord, nextRecord) =>
            prevRecord.month_spent != nextRecord.month_spent,
          title: 'Месяц',
          width: 160,
          render: (record) => {
            const monthdayPlan = getMonthdayPlan(record);
            return (
              <Text className={classNames(css.budgetCutsTable__amount, monthSpentAlert(record))}>
                {record.month_spent ? record.month_spent.toLocaleString() : 0} /{' '}
                {monthdayPlan.toLocaleString()}
              </Text>
            );
          },
        },
        {
          shouldCellUpdate: (prevRecord, nextRecord) =>
            prevRecord.month_plan != nextRecord.month_plan,
          title: 'План',
          width: 80,
          dataIndex: 'month_plan',
          render: (value) => (value ? value.toLocaleString() : 0),
        },
      ],
    },
    {
      shouldCellUpdate: (prevRecord, nextRecord) =>
        prevRecord.month_spent != nextRecord.month_spent ||
        prevRecord.budget_adjustment != nextRecord.budget_adjustment ||
        prevRecord.zero_days != nextRecord.zero_days ||
        prevRecord.month_plan != nextRecord.month_plan,
      title: 'Рек. открут',
      width: 100,
      render: (record) => getNecessaryExpenses(record),
    },
    {
      shouldCellUpdate: (prevRecord, nextRecord) =>
        prevRecord.month_plan != nextRecord.month_plan ||
        prevRecord.month_spent != nextRecord.month_spent ||
        prevRecord.balance != nextRecord.balance,
      title: 'Зачислить',
      width: 100,
      render: (record) => getNecessaryAmount(record),
    },
  ];

  return (
    <Table
      // ширина таблицы
      scroll={{
        x: screens.lg ? 1024 : screens.xs ? 512 : 768,
        y: screens.lg
          ? 'calc(100vh - 21em)'
          : screens.xs
          ? 'calc(100vh - 16em)'
          : 'calc(100vh - 16em)',
      }}
      rowKey='id'
      loading={isLoading || isFetching || isUpdating}
      dataSource={filteredData}
      columns={columns}
      size={'small'}
      pagination={false}
      showSorterTooltip={false}
      bordered
    />
  );
};
