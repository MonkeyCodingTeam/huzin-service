import { CompanyTemplate } from '@shared/lib/api/target/types';
import { Client } from '@entities/client';

export interface Group extends Model {
  name: string;
  link: string;
  screen_name: string;
  timezone?: number;
  is_target_only?: boolean;
  site?: string;
  city?: string;
  photo?: string;
  senler_token_protected?: string;
  senler_token?: string;
  has_access_token?: boolean;
}

export interface GroupOptionalProps {
  activity: string;
  ban_info: {
    end_date: number;
    comment: string;
  };
  can_post: boolean;
  can_see_all_posts: boolean;
  city: {
    id: number;
    title: string;
  };
  contacts: GroupContact[];
  counters: [];
  country: {
    id: number;
    title: string;
  };
  cover: {
    enabled: number;
    images: [];
  };
  description: string;
  finish_date: number;
  fixed_post: number;
  links: GroupLink[];
  market: []; // add market type
  members_count: number;
  place: GroupPlace;
  site: string;
  start_date: number | string;
  public_date_label: number | string;
  status: string;
  verified: boolean;
  wiki_page: string;
}

export interface GroupContact {
  user_id: number;
  desc: string;
  phone: string;
  email: string;
}

export interface GroupLink {
  id: number;
  url: string;
  name: string;
  desc: string;
  photo_50: string;
  photo_100: string;
}

export interface GroupPlace {
  id: number;
  title: string;
  latitude: number;
  longitude: number;
  type: string;
  country: number;
  city: number;
  address: string;
}

export interface GroupGetByProps {
  group_ids?: string | number;
  group_id?: string | number;
  fields?: (keyof GroupOptionalProps)[];
}

interface GroupGetInfo extends Partial<GroupOptionalProps> {
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

export interface GroupGetByResponse {
  groups: GroupGetInfo[];
  profiles: [];
}

export type GroupCreate = Omit<Group, 'created_at' | 'updated_at' | 'senler_token' | 'timezone'> &
  Partial<Pick<GroupPlace, 'latitude' | 'longitude'>>;

export interface GetSubscribersCountRequest {
  date_from: AppDate;
  date_to: AppDate;
  company_template_id?: CompanyTemplate['id'];
}

export interface GetSubscribersCountPeriodRequest extends GetSubscribersCountRequest {
  period?: 'day' | 'week' | 'month' | 'year';
}

export interface GetSubscribersCountResponse {
  success: boolean;
  count_subscribe: number;
  count_unsubscribe: number;
  group_id: number;
}

export type GetAllSubscribersCountResponse = Record<Client['id'], GetSubscribersCountResponse>;
