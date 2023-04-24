import { ReactNode } from 'react';
import { PrimeIconsOptions } from 'primereact/api';
import { ValueOf } from 'synckit';

export interface AppRoute {
  element: ReactNode;
  protected: boolean;
  name?: string;
  icon?: ValueOf<PrimeIconsOptions>;
  description?: string;
  path?: string;
  children?: Omit<AppRoute, 'protected'>[];
  index?: boolean;
}
