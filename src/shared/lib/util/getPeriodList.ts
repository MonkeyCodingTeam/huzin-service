import { DateTime } from 'luxon';
import { Period } from '@pages/Target/SenlerPage/ui/SenlerHeader';

type PeriodName = 'day' | 'week' | 'month' | 'year';

export const getPeriodList = (periodName: PeriodName, numOfPeriod: number) => {
  const periodList: Period[] = [];
  let now = DateTime.now();
  for (let i = 0; i < numOfPeriod; i++) {
    const date_from = now.startOf(periodName);
    const date_to = now.endOf(periodName);
    const range = () => {
      switch (periodName) {
        case 'day':
          return date_from.toFormat('dd.LL.yyyy');
        case 'week':
          if (i === 0) {
            return 'Текущая неделя';
          }
          if (i === 1) {
            return 'Предыдущая неделя';
          }
          return `${date_from.toFormat('dd.LL')} - ${date_to.toFormat('dd.LL')}`;
        case 'month':
          // eslint-disable-next-line no-case-declarations
          let month = date_from.setLocale('ru').toFormat('LLLL');
          month = month[0].toUpperCase() + month.slice(1);
          return month;
        case 'year':
          return date_from.toFormat('yyyy');
        default:
          return `${date_from.toFormat('dd.LL.yyyy')} - ${date_to.toFormat('dd.LL.yyyy')}`;
      }
    };
    periodList.push({
      date_from,
      date_to,
      range: range(),
    });
    now = now.minus({ [periodName]: 1 });
  }
  return periodList;
};
