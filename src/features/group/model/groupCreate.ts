import { Group, GroupPlace } from '@entities/group';

export type CreateGroupReq = Omit<
  Group,
  'created_at' | 'updated_at' | 'senler_token' | 'timezone'
> &
  Partial<Pick<GroupPlace, 'latitude' | 'longitude'>>;
