import type { DateTime } from 'luxon';

declare global {
  export type AppDate = Date | DateTime;
}
