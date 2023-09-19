import { Dayjs } from 'dayjs';

export interface Period {
  date_from: Dayjs;
  date_to: Dayjs;
}

export interface TableData {
  id: number;
  client_name: string;
  spent: number;
  subscribers: number;
  groupId: number;
  success: boolean;
  spentPerSub: number;
}
