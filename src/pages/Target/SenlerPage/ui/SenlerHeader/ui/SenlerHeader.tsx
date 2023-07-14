import { DateTime } from 'luxon';
import { ChangeEvent, FC, useEffect, useState } from 'react';
import style from '@pages/Target/BudgetCutsPage/ui/BudgetCutsHeader/ui/BudgetCutsHeader.module.scss';
import css from './SenlerHeader.module.scss';
import { InputText } from 'primereact/inputtext';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { Nullable } from 'primereact/ts-helpers';
import { getPeriodList } from '@shared/lib/util';

interface SenlerHeaderProps {
  filterChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onWeekChange: (weekStart: DateTime) => void;
  onRangeChange: (period: Period) => void;
}

export interface Period {
  range: string;
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
    setWeeks(getPeriodList('week', 8));
    // setMonths(getPeriodList('month', 3));
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

      onRangeChange({ ...range, range: 'day' });
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
