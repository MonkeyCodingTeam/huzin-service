import css from './NavLink.module.scss';
import { NavLink as RouterLink } from 'react-router-dom';
import classNames from 'classnames';

interface LinkProps {
  label?: string;
  children?: string;
  href: string;
  className?: string;
  state?: Record<string, unknown>;
}

export const NavLink = (props: LinkProps) => {
  const { href, label, children, className = '', state = {} } = props;

  return (
    <RouterLink
      to={href}
      state={state}
      style={({ isActive }) =>
        isActive ? { borderBottom: '2px solid var(--primary-color)' } : undefined
      }
      className={classNames(css.link, className)}
    >
      {label || children}
    </RouterLink>
  );
};
