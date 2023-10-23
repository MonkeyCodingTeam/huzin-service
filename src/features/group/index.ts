export type { CreateGroupReq } from './model/groupCreate';
export type { GetGroupReq, GetGroupRes } from './model/getGroup';
export type { UpdateGroupReq } from './model/updateGroup';

export { getOauthLink } from './lib/getOauthLink';

export {
  useLazyGetVKGroupByQuery,
  useCreateGroupMutation,
  useDeleteGroupMutation,
  useUpdateGroupMutation,
} from './api/groupAPI';

export { GroupAdd } from './ui/GroupAdd/GroupAdd';
export { GroupDelete } from './ui/GroupDelete/GroupDelete';
export { GroupSettingsForm } from './ui/GroupSettingsForm/GroupSettingsForm';
