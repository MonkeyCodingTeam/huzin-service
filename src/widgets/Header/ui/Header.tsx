import HR from '@shared/assets/HR.svg';
import css from './Header.module.scss';
import './Header.scss';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { useState } from 'react';
import { Avatar } from 'primereact/avatar';
import { ROUTES } from '@shared/const/routes';
import { NavLink } from '@shared/ui/NavLink';

export const Header = () => {
  const services = [
    { value: 'target', label: 'Target' },
    { value: 'content', label: 'Content' },
    { value: 'admin', label: 'Admin' },
  ];
  const [selectedService, setSelectedService] = useState(services[0].value);
  const handleChange = (e: DropdownChangeEvent) => {
    setSelectedService(e.value);
  };

  return (
    <header className={css.container}>
      <div className={css.header}>
        <div className={css.header__logo}>
          <HR />
          <Dropdown
            value={selectedService}
            onChange={handleChange}
            options={services}
            optionLabel='label'
          />
        </div>

        <div className={css.header__links}>
          <NavLink label={'Проекты'} href={ROUTES.TargetClients} />
          <NavLink label={'Senler'} href={ROUTES.TargetCompanies} />
          <NavLink label={'Открутка'} href={ROUTES.BudgetCuts} />
          <NavLink label={'Настройки'} href={ROUTES.TargetSettings} />
        </div>

        <Avatar icon='pi pi-user' size='large' shape='circle' className={css.header__profile} />
      </div>
    </header>
  );
};
