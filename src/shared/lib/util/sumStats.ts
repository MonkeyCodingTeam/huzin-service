import { ClientsStatisticResponse, StatisticResponse } from '@entities/client';
import { DateTime } from 'luxon';

const fields: (keyof Pick<StatisticResponse, 'spent' | 'impressions' | 'clicks' | 'reach'>)[] = [
  'spent',
  'impressions',
  'clicks',
  'reach',
];

export const sumStats = (
  stats: ClientsStatisticResponse[],
  dateField: keyof StatisticResponse = 'month',
): StatisticResponse[] => {
  const result: Record<StatisticResponse['month'], StatisticResponse> = {};
  stats.forEach((company) => {
    company.stats.forEach((stat: any) => {
      if (result[stat[dateField]]) {
        fields.forEach((field) => {
          (result[stat[dateField]][field] as number) =
            (+result[stat[dateField]][field] || 0) + (+stat[field] || 0);
        });
      } else {
        result[stat[dateField]] = { ...stat };
      }
    });
  }, {});
  return Object.values(result);
};

const setDateToFormatYMD = (day: string) => {
  return `${DateTime.fromFormat(day, 'yyyymmdd').toFormat('yyyy-mm-dd')}`;
};

export const sumStatsForPeriod = (
  stats: ClientsStatisticResponse[],
  period: 'day' | 'week' | 'month' | 'year',
): StatisticResponse[] => {
  const statistics: Record<StatisticResponse['period'], StatisticResponse> = {};
  stats.forEach((company) => {
    company.stats.forEach((stat: StatisticResponse) => {
      if (period === 'week') {
        stat.period = setDateToFormatYMD(stat.day_from);
      }
      if (period === 'month') {
        stat.period = stat.month;
      }
      if (statistics[stat['period']]) {
        fields.forEach((field) => {
          (statistics[stat['period']][field] as number) =
            (+statistics[stat['period']][field] || 0) + (+stat[field] || 0);
        });
      } else {
        statistics[stat['period']] = { ...stat };
      }
    }, {});
  });

  return Object.values(statistics);
};
