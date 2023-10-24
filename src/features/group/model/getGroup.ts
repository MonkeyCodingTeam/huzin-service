import { GroupOptionalProps } from '@entities/group';

interface GetGroupInfo extends Partial<GroupOptionalProps> {
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

export interface GetGroupReq {
  group_ids?: string | number;
  group_id?: string | number;
  fields?: (keyof GroupOptionalProps)[];
}

export interface GetGroupRes {
  groups: GetGroupInfo[];
  profiles: [];
}
