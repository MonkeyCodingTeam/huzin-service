import css from './BudgetCutsHeader.module.scss';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { DateTime } from 'luxon';
import { ChangeEvent, FC, useState } from 'react';

interface BudgetCutsHeaderProps {
  dateTime: DateTime;
  filterChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

export const BudgetCutsHeader: FC<BudgetCutsHeaderProps> = ({ dateTime, filterChange }) => {
  const users = [
    { id: 1, name: 'name 1' },
    { id: 2, name: 'name 2' },
    { id: 3, name: 'name 3' },
    { id: 4, name: 'name 4' },
  ];
  const [user, setUser] = useState(users[0]);

  return (
    <div className={css.header}>
      <div className={css.header_left}>
        <span>Последнее обновление: {dateTime.toFormat('dd.LL HH:mm')}</span>
        <InputText
          className={css.table__header_search}
          type='text'
          onChange={filterChange}
          placeholder='Поиск...'
        />
      </div>
      <label title='Выбрать проекты, привязанные к сотруднику' className={css.header_right}>
        Сотрудник:
        <Dropdown
          value={user}
          className={css.header_right}
          onChange={(e) => setUser(e.value)}
          options={users}
          optionLabel='name'
          placeholder='Не выбран'
        />
      </label>
    </div>
  );
};
