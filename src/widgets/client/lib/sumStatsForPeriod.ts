import { IClientStatsResp, IStatsResp } from '@entities/client';

const fields: (keyof Pick<IStatsResp, 'spent' | 'impressions' | 'clicks' | 'reach'>)[] = [
  'spent',
  'impressions',
  'clicks',
  'reach',
];
export const sumStatsForPeriod = (stats: IClientStatsResp[]): IStatsResp[] => {
  const result: Record<IStatsResp['period_date'], IStatsResp> = {};

  stats.forEach((campaign) => {
    campaign.stats.forEach((stat: IStatsResp) => {
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
