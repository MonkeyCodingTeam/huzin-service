import dayjs from 'dayjs';
import { ClientStatsReq } from '@entities/client';

// TODO вопрос по периодам (начальная дата и конечная дата)

export const monthPeriod: Omit<ClientStatsReq, 'id'> = {
  period: 'month',
  date_from: dayjs().subtract(6, 'month').format(),
  date_to: dayjs().format(),
};

export const weekPeriod: Omit<ClientStatsReq, 'id'> = {
  period: 'week',
  date_from: dayjs().subtract(3, 'week').format(),
  date_to: dayjs().format(),
};
