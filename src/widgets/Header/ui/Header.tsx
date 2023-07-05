import HR from '@shared/assets/HR.svg';
import css from './Header.module.scss';
import './Header.scss';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { FC, memo, MouseEvent, ReactElement, useEffect, useRef, useState } from 'react';
import { Avatar } from 'primereact/avatar';
import { NavLink } from '@shared/ui/NavLink';
import { useAppDispatch, useAppSelector } from '@shared/lib/redux';
import { MenuItem } from 'primereact/menuitem';
import { Menu } from 'primereact/menu';
import { useNavigate } from 'react-router';
import {
  AdminRoutes,
  type appService,
  ContentRoutes,
  ROUTES,
  TargetRoutes,
} from '@app/providers/RouterProvider';
import { AuthThunk } from '@processes/auth';
import { Link } from 'react-router-dom';

export const Header: FC<{ children: ReactElement }> = ({ children }) => {
  const appServices: appService[] = [
    { value: TargetRoutes, label: 'Target', base: 'target', access: ['manager', 'accountant'] },
    { value: ContentRoutes, label: 'Content', base: 'content', access: ['content'] },
    { value: AdminRoutes, label: 'Admin', base: 'admin' },
  ];

  const [selectedService, setSelectedService] = useState<appService['value']>();
  const user = useAppSelector((state) => state.user);
  const menu = useRef<Menu>(null);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [services, setServices] = useState<appService[]>([]);

  useEffect(() => {
    setServices(() => {
      if (user.roles.find((role) => role.slug === 'admin')) return appServices;

      return appServices.filter((service) =>
        user.roles.find((role) => service.access?.find((access) => access === role.slug)),
      );
    });
  }, [user.roles]);

  useEffect(() => {
    setSelectedService(() => {
      if (!services.length) return;

      const base = location.pathname.split('/')[1];
      return services.find((item) => item.base === base)?.value || services[0].value;
    });
  }, [services, navigate]);

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

  const renderLinks = () => {
    if (!selectedService) return;

    return selectedService.map((route) => {
      return <NavLink key={route.path} label={route.name} href={route.path || '#'} />;
    });
  };

  const handleChange = (e: DropdownChangeEvent) => {
    setSelectedService(e.value);
  };

  const handleProfileMenuToggle = (e: MouseEvent<HTMLButtonElement>) => menu.current?.toggle(e);

  return (
    <div>
      <header className={css.header}>
        <div className={css.header__logo}>
          <Link to={'/'}>
            <HR />
          </Link>
          <Dropdown
            value={selectedService}
            onChange={handleChange}
            options={services}
            optionLabel='label'
          />
        </div>

        <div className={css.header__links}>{renderLinks()}</div>

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