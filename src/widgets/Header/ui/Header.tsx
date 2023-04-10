import HR from '@shared/assets/HR.svg';
import css from './Header.module.scss';
import './Header.scss';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { FC, memo, ReactNode, useState } from 'react';
import { Avatar } from 'primereact/avatar';
import { NavLink } from '@shared/ui/NavLink';
import { TargetRoutes } from '@app/providers/RouterProvider/lib/TargetRoutes';
import { AppRoute } from '@app/providers/RouterProvider/types';

export const Header: FC<{ children: ReactNode }> = ({ children }) => {
  const services = [
    { value: TargetRoutes, label: 'Target' },
    { value: TargetRoutes, label: 'Content' },
    { value: TargetRoutes, label: 'Admin' },
  ];
  const [selectedService, setSelectedService] = useState<AppRoute[]>(services[0].value);
  const handleChange = (e: DropdownChangeEvent) => {
    setSelectedService(e.value);
  };

  return (
    <div>
      <header className={css.header}>
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
          {selectedService.map((route) => (
            <NavLink key={route.path} label={route.name} href={route.path || '#'} />
          ))}
        </div>

        <Avatar icon='pi pi-user' size='large' shape='circle' className={css.header__profile} />
      </header>
      <div className={css.container}>{children}</div>
    </div>
  );
};

export const HeaderMemo = memo(Header);