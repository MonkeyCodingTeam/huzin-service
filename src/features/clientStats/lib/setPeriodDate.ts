import { DateTime } from 'luxon';
import { IClientStatsRes } from '@features/clientStats';

const setDateToFormatYMD = (day: string) => {
  return `${DateTime.fromFormat(day, 'yyyymmdd').toFormat('yyyy-mm-dd')}`;
};

export const setPeriodDate = (client: IClientStatsRes, period: TPeriod): IClientStatsRes => {
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
