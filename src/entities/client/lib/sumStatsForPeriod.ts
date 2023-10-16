import { ClientStatsRes, StatsRes } from '@entities/client';

const fields: (keyof Pick<StatsRes, 'spent' | 'impressions' | 'clicks' | 'reach'>)[] = [
  'spent',
  'impressions',
  'clicks',
  'reach',
];
export const sumStatsForPeriod = (stats: ClientStatsRes[]): StatsRes[] => {
  const result: Record<StatsRes['period_date'], StatsRes> = {};

  stats.forEach((campaign) => {
    campaign.stats.forEach((stat: StatsRes) => {
      if (result[stat['period_date']]) {
        fields.forEach((field) => {
          (result[stat['period_date']][field] as number) =
            (+result[stat['period_date']][field] || 0) + (+stat[field] || 0);
        });
      } else {
        result[stat['period_date']] = { ...stat };
      }
    });
  }, {});
  return Object.values(result);
};
