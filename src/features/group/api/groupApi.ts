import { axiosAppInstance } from '@shared/lib/axios';
import { GroupCreateByLink } from '../model/group';

export const GroupAPI = () => {
  (payload: GroupCreateByLink) => axiosAppInstance.post('group/createByLink', payload);
};
