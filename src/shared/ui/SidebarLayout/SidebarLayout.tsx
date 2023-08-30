import css from './SidebarLayout.module.scss';
import { FC, ReactNode } from 'react';

interface Props {
  sidebar: ReactNode;
  content: ReactNode;
}

export const SidebarLayout: FC<Props> = ({ sidebar, content }) => {
  return (
    <div className={css.layout}>
      <div className={css.layout__sidebar}>{sidebar}</div>
      <div className={css.layout__content}>{content}</div>
    </div>
  );
};
