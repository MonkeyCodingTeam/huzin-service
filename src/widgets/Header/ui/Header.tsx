import HR from '@shared/assets/HR.svg';
import css from './Header.module.scss';
import './Header.scss';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { FC, memo, ReactElement, useState } from 'react';
import { Avatar } from 'primereact/avatar';
import { NavLink } from '@shared/ui/NavLink';
import { TargetRoutes } from '@app/providers/RouterProvider/lib/TargetRoutes';
import { AppRoute } from '@app/providers/RouterProvider/types';
import { useAppSelector } from '@shared/lib/redux';

export const Header: FC<{ children: ReactElement }> = ({ children }) => {
  const services = [
    { value: TargetRoutes, label: 'Target' },
    { value: TargetRoutes, label: 'Content' },
    { value: TargetRoutes, label: 'Admin' },
  ];
  const [selectedService, setSelectedService] = useState<AppRoute[]>(services[0].value);
  const user = useAppSelector((state) => state.user);

  if (!user?.id) return children;

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
        <div>
          {user.name}
          <Avatar icon='pi pi-user' size='large' shape='circle' className={css.header__profile} />
        </div>
      </header>
      <div className={css.container}>{children}</div>
    </div>
  );
};

export const HeaderMemo = memo(Header);