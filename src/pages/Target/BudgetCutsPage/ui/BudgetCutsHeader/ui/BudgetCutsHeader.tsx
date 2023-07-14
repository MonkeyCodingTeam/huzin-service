import css from './BudgetCutsHeader.module.scss';
import { InputText } from 'primereact/inputtext';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { DateTime } from 'luxon';
import { ChangeEvent, FC } from 'react';
import { User } from '@entities/user';

interface BudgetCutsHeaderProps {
  users: User[];
  filterChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onUserChange: (event: DropdownChangeEvent) => void;
  selectedUser?: User;
  dateTime?: DateTime;
}

export const BudgetCutsHeader: FC<BudgetCutsHeaderProps> = ({
  users,
  selectedUser,
  onUserChange,
  dateTime,
  filterChange,
}) => {
  return (
    <div className={css.header}>
      <div className={css.header_left}>
        {dateTime && <span>Последнее обновление: {dateTime.toFormat('dd.LL HH:mm')}</span>}
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
          showClear
          value={selectedUser}
          className={css.header_right}
          onChange={onUserChange}
          options={users}
          optionLabel='name'
          placeholder='Не выбран'
        />
      </label>
    </div>
  );
};
