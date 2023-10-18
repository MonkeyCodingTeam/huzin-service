import { Group } from '@entities/group';

export type GroupCreateByLink = Pick<Group, 'link' | 'is_target_only'>;
