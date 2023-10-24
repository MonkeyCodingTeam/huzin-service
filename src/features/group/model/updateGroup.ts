import { Group } from '@entities/group';

export type UpdateGroupReq = Pick<
  Group,
  'name' | 'link' | 'screen_name' | 'city' | 'timezone' | 'photo' | 'senler_token'
>;
