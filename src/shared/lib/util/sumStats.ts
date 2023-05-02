import { ClientsStatisticResponse, StatisticResponse } from '@shared/lib/api/target/types';

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
    company.stats.forEach((stat) => {
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
