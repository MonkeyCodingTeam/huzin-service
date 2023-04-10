import { ReactNode } from 'react';

export interface AppRoute {
  element: ReactNode;
  name?: string;
  header?: boolean;
  path?: string;
  protected: boolean;
  children?: Omit<AppRoute, 'protected'>[];
  index?: boolean;
}
