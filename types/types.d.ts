import type { DateTime } from 'luxon';

declare global {
  export type AppDate = Date | DateTime;

  export interface Model {
    id: number;
    created_at?: string;
    updated_at?: string;
  }

  export type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';

  export type TPeriod = 'day' | 'week' | 'month' | 'year';

  // eslint-disable-next-line @typescript-eslint/consistent-type-imports
  declare type RootState = import('../src/app/store/lib/store').RootState;
  // eslint-disable-next-line @typescript-eslint/consistent-type-imports
  declare type AppDispatch = import('../src/app/store/lib/store').AppDispatch;
}
