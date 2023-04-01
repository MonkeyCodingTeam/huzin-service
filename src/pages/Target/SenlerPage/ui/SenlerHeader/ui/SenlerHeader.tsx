import { DateTime } from 'luxon';
import { ChangeEvent, FC, useEffect, useState } from 'react';
import style from '@pages/Target/BudgetCutsPage/ui/BudgetCutsHeader/ui/BudgetCutsHeader.module.scss';
import css from './SenlerHeader.module.scss';
import { InputText } from 'primereact/inputtext';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';

interface SenlerHeaderProps {
  dateTime: DateTime;
  filterChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onWeekChange: (weekStart: DateTime) => void;
}

type PeriodName = 'day' | 'week' | 'month' | 'year';

interface Period {
  range: string;
  start_date: DateTime;
  end_date: DateTime;
}

export const SenlerHeader: FC<SenlerHeaderProps> = ({ dateTime, filterChange, onWeekChange }) => {
  const [period, setPeriod] = useState<Period>();
  const [weeks, setWeeks] = useState<Period[]>([]);
  // const [months, setMonths] = useState<Period[]>([]);

  useEffect(() => {
    setWeeks(getPeriodList('week', 8));
    // setMonths(getPeriodList('month', 3));
  }, []);

  useEffect(() => {
    setPeriod(weeks[0]);
    onWeekChange(weeks[0]?.start_date);
  }, [weeks]);

  const handlePeriodChange = (e: DropdownChangeEvent) => {
    setPeriod(e.value);
    onWeekChange(e.value?.start_date);
  };

  return (
    <div className={style.header}>
      <div className={style.header_left}>
        <span>Последнее обновление: {dateTime.toFormat('dd.LL HH:mm')}</span>
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
          <Dropdown
            required={true}
            value={period}
            onChange={handlePeriodChange}
            options={weeks}
            optionLabel='range'
            placeholder='Неделя'
          />
        </div>
      </div>
    </div>
  );
};

function getPeriodList(periodName: PeriodName, numOfPeriod: number) {
  const weekList: Period[] = [];
  let now = DateTime.now();
  for (let i = 0; i < numOfPeriod; i++) {
    const start_date = now.startOf(periodName);
    const end_date = now.endOf(periodName);
    const range = () => {
      switch (periodName) {
        case 'day':
          return start_date.toFormat('dd.LL.yyyy');
        case 'week':
          if (i === 0) {
            return 'Текущая неделя';
          }
          if (i === 1) {
            return 'Предыдущая неделя';
          }
          return `${start_date.toFormat('dd.LL')} - ${end_date.toFormat('dd.LL')}`;
        case 'month':
          // eslint-disable-next-line no-case-declarations
          let month = start_date.setLocale('ru').toFormat('LLLL');
          month = month[0].toUpperCase() + month.slice(1);
          return month;
        case 'year':
          return start_date.toFormat('yyyy');
        default:
          return `${start_date.toFormat('dd.LL.yyyy')} - ${end_date.toFormat('dd.LL.yyyy')}`;
      }
    };
    weekList.push({
      start_date,
      end_date,
      range: range(),
    });
    now = now.minus({ [periodName]: 1 });
  }
  return weekList;
}
