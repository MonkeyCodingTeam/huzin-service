import { StatsRes } from '@entities/client';

export const setCostPerClick = (clientStats: StatsRes) => {
  const { clicks, spent } = clientStats;
  return spent && clicks ? (spent / clicks).toFixed(2) : 0;
};
