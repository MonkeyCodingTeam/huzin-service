import { Client } from '@entities/client';
import { getDayDiff, getMonthdayDiff, getWeekdayDiff } from '@widgets/budgetCuts';
import css from '../ui/BudgetCutsTable/BudgetCutsTable.module.scss';

export const alertStyle = (
  difference: number,
  level: { low: number; middle: number; height: number },
) => {
  if (level.height < difference) {
    return css.budgetCutsTable__amount_criticalWarn;
  }
  if (level.middle < difference) {
    return css.budgetCutsTable__amount_warn;
  }
  if (level.low < difference) {
    return css.budgetCutsTable__amount_lowWarn;
  }
  return;
};

export const balanceAlert = (client: Client) => {
  if (client.balance < client.critical_balance) {
    return css.budgetCutsTable__amount_criticalWarn;
  }
  if (client.balance < client.critical_balance * 1.4) {
    return css.budgetCutsTable__amount_warn;
  }
  return;
};

export const daySpentAlert = (client: Client) => {
  const dayDiff = getDayDiff(client);
  const difference = dayDiff === undefined ? 1 : dayDiff;
  return alertStyle(difference, { low: 0.2, middle: 0.5, height: 0.7 });
};

export const weekSpentAlert = (client: Client) => {
  const weekdayDiff = getWeekdayDiff(client);
  const difference = weekdayDiff === undefined ? 1 : weekdayDiff;
  return alertStyle(difference, { low: 0.15, middle: 0.3, height: 0.5 });
};

export const monthSpentAlert = (client: Client) => {
  const monthdayDiff = getMonthdayDiff(client);
  const difference = monthdayDiff === undefined ? 1 : monthdayDiff;
  return alertStyle(difference, { low: 0.07, middle: 0.13, height: 0.2 });
};
