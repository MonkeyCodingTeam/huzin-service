import { DateTime } from 'luxon';
import { IClientStatResp, IStatResp } from '@entities/client';

const fields: (keyof Pick<IStatResp, 'spent' | 'impressions' | 'clicks' | 'reach'>)[] = [
  'spent',
  'impressions',
  'clicks',
  'reach',
];

// TODO старая реализация
// export const sumStats = (
//   stats: ClientsStatisticResponse[],
//   dateField: keyof StatisticResponse = 'month',
// ): StatisticResponse[] => {
//   const result: Record<StatisticResponse['month'], StatisticResponse> = {};
//   stats.forEach((company) => {
//     company.stats.forEach((stat: any) => {
//       if (result[stat[dateField]]) {
//         fields.forEach((field) => {
//           (result[stat[dateField]][field] as number) =
//             (+result[stat[dateField]][field] || 0) + (+stat[field] || 0);
//         });
//       } else {
//         result[stat[dateField]] = { ...stat };
//       }
//     });
//   }, {});
//   return Object.values(result);
// };

const setDateToFormatYMD = (day: string) => {
  return `${DateTime.fromFormat(day, 'yyyymmdd').toFormat('yyyy-mm-dd')}`;
};

export const sumStatsForPeriod = (
  stats: IClientStatResp[],
  period: 'day' | 'week' | 'month' | 'year',
): IStatResp[] => {
  const statistics: Record<IStatResp['period'], IStatResp> = {};

  // TODO Упростить + доделать
  const setPeriod = (company: IClientStatResp) => {
    if (period === 'week') {
      return company.stats.map((stat) => ({
        ...stat,
        period: setDateToFormatYMD(stat.day_from),
      }));
    }
    return company.stats.map((stat) => ({
      ...stat,
      period: stat.month,
    }));
  };

  stats.map((company) => {
    setPeriod(company);
  });

  return Object.values(statistics);
};
