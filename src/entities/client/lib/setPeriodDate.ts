import { DateTime } from 'luxon';
import { IClientStatsResp } from '@entities/client';

const setDateToFormatYMD = (day: string) => {
  return `${DateTime.fromFormat(day, 'yyyymmdd').toFormat('yyyy-mm-dd')}`;
};

export const setPeriodDate = (
  client: IClientStatsResp,
  // TODO передать из типов
  period: 'day' | 'week' | 'month' | 'year',
): IClientStatsResp => {
  client.stats = client.stats.map((campaignStats) => {
    let datePeriod;
    switch (period) {
      case 'week':
        datePeriod = setDateToFormatYMD(campaignStats.day_from);
        break;
      default:
        datePeriod = campaignStats.month;
        break;
    }
    return { ...campaignStats, period_date: datePeriod };
  });
  return client;
};
