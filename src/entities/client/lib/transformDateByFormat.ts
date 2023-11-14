import { DateTime } from 'luxon';

// YYYY/MM/DD
const datePattern = /^([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/;

export const transformDateByFormat = (value: string) => {
  if (value.match(datePattern)) {
    return DateTime.fromFormat(value, 'yyyy-MM-dd').toFormat('dd.MM');
  }
  const monthName = DateTime.fromFormat(value, 'yyyy-LL').setLocale('ru').toFormat('LLLL');
  return monthName.charAt(0).toUpperCase() + monthName.slice(1);
};
