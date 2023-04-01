import css from './Link.module.scss';
import { Link as RouterLink } from 'react-router-dom';
import classNames from 'classnames';
import { HTMLAttributeAnchorTarget, ReactNode } from 'react';
import { ComponentProps } from '@shared/ui/types';

interface LinkProps extends ComponentProps {
  label?: string;
  target?: HTMLAttributeAnchorTarget;
  children?: ReactNode;
  href: string;
  className?: string;
  state?: Record<string, unknown>;
}

export const Link = (props: LinkProps) => {
  const { href, label, children, target = '_self', className = '', state = {} } = props;

  return (
    <RouterLink
      {...props}
      target={target}
      to={href}
      state={state}
      className={classNames(css.link, className)}
    >
      {label || children}
    </RouterLink>
  );
};
