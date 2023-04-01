import { DateTime } from 'luxon';
import { Client } from '@shared/lib/api/target/types/client';

export interface Group {
  id: number;
  name: string;
  link: string;
  screen_name: string;
  city?: string;
  timezone?: number;
  photo?: string;
  senler_token_protected?: string;
  senler_token?: string;
  created_at?: Date;
  updated_at?: Date;
}

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

interface GroupOptionalProps {
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

interface GroupContact {
  user_id: number;
  desc: string;
  phone: string;
  email: string;
}

interface GroupLink {
  id: number;
  url: string;
  name: string;
  desc: string;
  photo_50: string;
  photo_100: string;
}

interface GroupPlace {
  id: number;
  title: string;
  latitude: number;
  longitude: number;
  type: string;
  country: number;
  city: number;
  address: string;
}

export type GroupCreate = Omit<Group, 'created_at' | 'updated_at' | 'senler_token'>;

export interface GetSubscribersCountRequest {
  date_from: DateTime;
  date_to: DateTime;
  subscription_id?: number[];
}

export interface GetSubscribersCountResponse {
  success: boolean;
  count_subscribe: number;
  count_unsubscribe: number;
  group_id: number;
}

export type GetAllSubscribersCountResponse = Record<Client['id'], GetSubscribersCountResponse>
