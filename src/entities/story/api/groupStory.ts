import { axiosContentInstance } from '@shared/lib/axios';

export const GroupStoryAPI = {
  store: async (groupId: number, payload: FormData) =>
    axiosContentInstance.post(`group/${groupId}/story`, payload),
};
