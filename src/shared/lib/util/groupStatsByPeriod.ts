// import { ClientsStatisticResponse, StatisticResponse } from '@shared/lib/api/target/types';
//
import {DateTime} from 'luxon'; //
import {ClientsStatisticResponse, PeriodStatistic, SummeryFields,} from '@shared/lib/api/target/types';

const fields: (keyof SummeryFields)[] = ['spent', 'clicks', 'shows'];

export const groupStatsByPeriod = (
  stats: ClientsStatisticResponse,
  period: 'day' | 'week' | 'month' = 'month',
): PeriodStatistic[] => {
  const result: Record<string, PeriodStatistic> = {};
  if (!stats.items) {
    return [];
  }
  stats.items.forEach((item) => {
    if (!item.rows) return;
    item.rows.forEach((row) => {
      const date = DateTime.fromFormat(row.date, 'yyyy-MM-dd')
        .startOf(period)
        .toFormat('yyyy-MM-dd');
      if (!result[date]) {
        result[date] = {
          date: date,
          spent: 0,
          shows: 0,
          clicks: 0,
        };
      }
      fields.forEach((field) => {
        result[date][field] += row.base ? +row.base[field] : 0;
      });
    });
  });

  return Object.values(result);
};
