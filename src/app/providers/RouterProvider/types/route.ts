import { ReactNode } from 'react';
import { PrimeIconsOptions } from 'primereact/api';
import { ValueOf } from 'synckit';
import { Role } from '@entities/user';

export interface AppRoute {
  element: ReactNode;
  name?: string;
  icon?: ValueOf<PrimeIconsOptions>;
  description?: string;
  path?: string;
  children?: Omit<AppRoute, 'protected'>[];
  index?: boolean;
  access?: Role['slug'][];
}
