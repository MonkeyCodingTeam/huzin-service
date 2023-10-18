import type { DateTime } from 'luxon';

declare global {
  export type AppDate = Date | DateTime;

  export interface Model {
    id: number;
    created_at?: string;
    updated_at?: string;
  }

  interface Error<T extends {}> {
    error: {
      status: number;
      data: {
        message: string;
        errors: Partial<Record<keyof T, string[]>>;
      };
    };
  }

  export type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';

  export type Period = 'day' | 'week' | 'month' | 'year';

  // eslint-disable-next-line @typescript-eslint/consistent-type-imports
  declare type RootState = import('../src/app/store/lib/store').RootState;
  // eslint-disable-next-line @typescript-eslint/consistent-type-imports
  declare type AppDispatch = import('../src/app/store/lib/store').AppDispatch;
}
