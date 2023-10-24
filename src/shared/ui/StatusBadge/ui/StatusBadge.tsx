import { Badge } from 'antd';
import React, { ReactNode } from 'react';
import css from './StatusBadge.module.scss';

interface Props {
  isError: Boolean;
  children: ReactNode;
}

export const StatusBadge = ({ isError, children }: Props) => {
  if (!isError) return <>{children}</>;
  return (
    <div className={css.statusBadge}>
      <Badge status={'error'} />
      {children}
    </div>
  );
};
