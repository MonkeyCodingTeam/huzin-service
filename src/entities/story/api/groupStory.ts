import { axiosContentInstance } from '@shared/lib/axios';
import { AxiosPromise } from 'axios';
import { Story } from '@entities/story';

export const GroupStoryAPI = {
  getAll: async (groupId: number): AxiosPromise<Story[]> =>
    axiosContentInstance.get(`group/${groupId}/story`),
  create: async (groupId: number, payload: FormData): AxiosPromise<Story> =>
    axiosContentInstance.post(`group/${groupId}/story`, payload),
  delete: async (storyId: Story['id']): AxiosPromise<Story> =>
    axiosContentInstance.delete(`story/${storyId}`),
};
