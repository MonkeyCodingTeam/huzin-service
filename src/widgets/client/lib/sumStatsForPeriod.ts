import { IClientStatsRes, IStatsRes } from '@features/clientStats';

const fields: (keyof Pick<IStatsRes, 'spent' | 'impressions' | 'clicks' | 'reach'>)[] = [
  'spent',
  'impressions',
  'clicks',
  'reach',
];
export const sumStatsForPeriod = (stats: IClientStatsRes[]): IStatsRes[] => {
  const result: Record<IStatsRes['period_date'], IStatsRes> = {};

  stats.forEach((campaign) => {
    campaign.stats.forEach((stat: IStatsRes) => {
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
