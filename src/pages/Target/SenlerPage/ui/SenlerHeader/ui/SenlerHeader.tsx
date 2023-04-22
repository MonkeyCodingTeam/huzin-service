import { DateTime } from 'luxon';
import { ChangeEvent, FC, useEffect, useState } from 'react';
import style from '@pages/Target/BudgetCutsPage/ui/BudgetCutsHeader/ui/BudgetCutsHeader.module.scss';
import css from './SenlerHeader.module.scss';
import { InputText } from 'primereact/inputtext';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { Nullable } from 'primereact/ts-helpers';

interface SenlerHeaderProps {
  filterChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onWeekChange: (weekStart: DateTime) => void;
  onRangeChange: (date_from: Period['date_from'], date_to: Period['date_to']) => void;
}

type PeriodName = 'day' | 'week' | 'month' | 'year';

export interface Period {
  range?: string;
  date_from: DateTime;
  date_to: DateTime;
}

export const SenlerHeader: FC<SenlerHeaderProps> = (props) => {
  const { filterChange, onWeekChange, onRangeChange } = props;
  const [period, setPeriod] = useState<Period>();
  const [dates, setDates] = useState<Nullable<string | Date | Date[]>>(null);
  const [weeks, setWeeks] = useState<Period[]>([]);

  const maxDate = new Date();
  // const [months, setMonths] = useState<Period[]>([]);

  useEffect(() => {
    const weekList = getPeriodList('week', 8);
    setWeeks(weekList);
    onWeekChange(weekList[1]?.date_from);
  }, []);

  useEffect(() => {
    setPeriod(weeks[1]);
    onWeekChange(weeks[1]?.date_from);
  }, [weeks]);

  useEffect(() => {
    if (Array.isArray(dates) && dates[0] && dates[1]) {
      const range = {
        date_from: DateTime.fromJSDate(dates[0]),
        date_to: DateTime.fromJSDate(dates[1]),
      };
      setPeriod({
        ...range,
        range: 'custom',
      });

      onRangeChange(range.date_from, range.date_to);
    }
  }, [dates]);

  const handlePeriodChange = (e: DropdownChangeEvent) => {
    setDates(null);
    setPeriod(e.value);
    onWeekChange(e.value?.date_from);
  };

  return (
    <div className={style.header}>
      <div className={style.header_left}>
        <div className={css.panel}>
          <InputText
            className={style.table__header_search}
            type='text'
            onChange={filterChange}
            placeholder='Поиск...'
          />
          {/*<Dropdown*/}
          {/*  required={true}*/}
          {/*  value={period}*/}
          {/*  onChange={handlePeriodChange}*/}
          {/*  options={months}*/}
          {/*  optionLabel='range'*/}
          {/*  placeholder='Месяц'*/}
          {/*/>*/}
          <label className={css.panel}>
            Неделя:
            <Dropdown
              required={true}
              value={period}
              onChange={handlePeriodChange}
              options={weeks}
              optionLabel='range'
              placeholder='Выберите неделю'
            />
          </label>
          <label className={css.panel}>
            Период:
            <Calendar
              value={dates}
              onChange={(e) => setDates(e.value)}
              selectionMode='range'
              readOnlyInput
              maxDate={maxDate}
              numberOfMonths={2}
              dateFormat='dd.mm.yy'
              placeholder='Выберите дату'
            />
          </label>
        </div>
      </div>
    </div>
  );
};

function getPeriodList(periodName: PeriodName, numOfPeriod: number) {
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
}
