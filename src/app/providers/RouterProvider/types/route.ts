import type { ReactNode } from 'react';
import type { PrimeIconsOptions } from 'primereact/api';
import type { ValueOf } from 'synckit';
import type { Role } from '@entities/user';

export interface AppRoute {
  element: ReactNode;
  name?: string;
  icon?: ValueOf<PrimeIconsOptions>;
  description?: string;
  path?: string;
  children?: Omit<AppRoute, 'protected'>[];
  index?: boolean;
  access?: Role['slug'][];
  loader?: (...arg: any[]) => any;
}
