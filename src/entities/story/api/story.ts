import { AxiosPromise } from 'axios';
import { axiosContentInstance } from '@shared/lib/axios';

export const StoryAPI = {
  get: async (storyId: number): AxiosPromise => axiosContentInstance.get(`/story/${storyId}`),
};
