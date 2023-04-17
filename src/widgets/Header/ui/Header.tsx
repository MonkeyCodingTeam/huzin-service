import HR from '@shared/assets/HR.svg';
import css from './Header.module.scss';
import './Header.scss';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { FC, memo, MouseEvent, ReactElement, useRef, useState } from 'react';
import { Avatar } from 'primereact/avatar';
import { NavLink } from '@shared/ui/NavLink';
import { TargetRoutes } from '@app/providers/RouterProvider/lib/TargetRoutes';
import { AppRoute } from '@app/providers/RouterProvider/types';
import { useAppDispatch, useAppSelector } from '@shared/lib/redux';
import { MenuItem } from 'primereact/menuitem';
import { Menu } from 'primereact/menu';
import { useNavigate } from 'react-router';
import { ROUTES } from '@shared/const/routes';
import { AuthThunk } from '@processes/auth';

export const Header: FC<{ children: ReactElement }> = ({ children }) => {
  const services = [
    { value: TargetRoutes, label: 'Target' },
    { value: TargetRoutes, label: 'Content' },
    { value: TargetRoutes, label: 'Admin' },
  ];
  const [selectedService, setSelectedService] = useState<AppRoute[]>(services[0].value);
  const user = useAppSelector((state) => state.user);
  const menu = useRef<Menu>(null);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  if (!user?.id) return children;

  const profileMenuItems: MenuItem[] = [
    {
      label: 'Профиль',
      icon: 'pi pi-user',
    },
    {
      separator: true,
    },
    {
      label: 'Выйти',
      icon: 'pi pi-sign-out',
      command: () => {
        // return navigate(ROUTES.AUTH.Login);
        dispatch(AuthThunk.logout()).then(() => {
          return navigate(ROUTES.AUTH.Login);
        });
      },
    },
  ];

  const handleChange = (e: DropdownChangeEvent) => {
    setSelectedService(e.value);
  };

  const handleProfileMenuToggle = (e: MouseEvent<HTMLButtonElement>) => menu.current?.toggle(e);

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
        <Menu model={profileMenuItems} popup ref={menu} />
        <button className={css.header__profile} onClick={handleProfileMenuToggle}>
          {user.name}
          <Avatar
            icon='pi pi-user'
            size='large'
            shape='circle'
            className={css.header__profile__img}
          />
        </button>
      </header>
      <div className={css.container}>{children}</div>
    </div>
  );
};

export const HeaderMemo = memo(Header);