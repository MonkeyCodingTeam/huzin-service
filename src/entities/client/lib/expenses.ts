import { DateTime } from 'luxon';
import { Client } from '@entities/client';

const dateTime = DateTime.now();
const daysInMonth = dateTime.daysInMonth;
const monthday = dateTime.day;
const weekday = dateTime.weekday;

export const getDayPlan = (client: Client) => Math.trunc(client.month_plan / daysInMonth);

export const getWeekdayPlan = (client: Client) =>
  Math.trunc((client.month_plan / daysInMonth) * weekday);

export const getMonthdayPlan = (client: Client) =>
  Math.trunc((client.month_plan / daysInMonth) * monthday);

export const getDayDiff = (client: Client) => {
  const dayPlan = getDayPlan(client);
  return Math.abs(dayPlan && (dayPlan - client.day_spent) / dayPlan);
};

export const getWeekdayDiff = (client: Client) => {
  const weekdayPlan = getWeekdayPlan(client);
  return Math.abs(weekdayPlan && (weekdayPlan - client.week_spent) / weekdayPlan);
};

export const getMonthdayDiff = (client: Client) => {
  const monthdayPlan = getMonthdayPlan(client);
  return Math.abs(monthdayPlan && (monthdayPlan - client.month_spent) / monthdayPlan);
};

export const getNecessaryExpenses = (client: Client) => {
  if (getMonthdayPlan(client) && getMonthdayPlan(client) < client.month_spent) {
    return '-';
  }
  const dayDifference = daysInMonth - monthday;

  if (dayDifference === 0) {
    return '-';
  }

  if (client.zero_days) {
    return Math.trunc(
      (client.month_plan +
        client.budget_adjustment -
        client.month_spent -
        client.zero_days * (getDayPlan(client) || 0)) /
        dayDifference,
    ).toLocaleString();
  }

  const differencePlan = client.month_plan - client.month_spent;
  const required = Math.trunc(differencePlan / dayDifference);

  return required.toLocaleString();
};

export const getNecessaryAmount = (client: Client) => {
  const amount = client.month_plan - client.month_spent - client.balance;
  return amount > 0 ? amount.toLocaleString() : '-';
};
