import classNames from 'classnames';
import { FC, ReactNode } from 'react';

interface InputGroupProps {
  className?: string;
  children: ReactNode;
}

export const InputGroup: FC<InputGroupProps> = ({ className, children }) => {
  return <div className={classNames('p-inputgroup', className)}>{children}</div>;
};
