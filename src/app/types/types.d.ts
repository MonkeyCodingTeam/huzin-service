import type { DateTime } from 'luxon';

declare global {
  export type AppDate = Date | DateTime;

  export interface Model {
    id: number;
    created_at?: string;
    updated_at?: string;
  }
}
