import {DateTime} from 'luxon';
import {Client} from '@entities/client/types';
import {Group, GroupOptionalProps, GroupPlace} from '@entities/group/types';
import {CompanyTemplate} from '@shared/lib/api/target/types/company';

export interface GroupGetByProps {
  group_ids?: string | number;
  group_id?: string | number;
  fields?: (keyof GroupOptionalProps)[];
}

export interface GroupGetByResponse extends Partial<GroupOptionalProps> {
  id: number;
  name: string;
  screen_name: string;
  is_close: 0 | 1 | 2;
  deactivated: 'deleted' | 'banned';
  is_admin: boolean;
  admin_level: 1 | 2 | 3;
  is_member: boolean;
  is_advertiser: boolean;
  type: 'group' | 'page' | 'event';
  photo_50: string;
  photo_100: string;
  photo_200: string;
}

export type GroupCreate =
  Omit<Group, 'created_at' | 'updated_at' | 'senler_token'>
  & Partial<Pick<GroupPlace, 'latitude' | 'longitude'>>;

export interface GetSubscribersCountRequest {
  date_from: DateTime;
  date_to: DateTime;
  company_template_id?: CompanyTemplate['id'];
}

export interface GetSubscribersCountPriodRequest extends GetSubscribersCountRequest {
  period?: 'day' | 'week' | 'month';
}

export interface GetSubscribersCountResponse {
  success: boolean;
  count_subscribe: number;
  count_unsubscribe: number;
  group_id: number;
}

export type GetAllSubscribersCountResponse = Record<Client['id'], GetSubscribersCountResponse>;
