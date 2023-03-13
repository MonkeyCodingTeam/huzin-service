import { axiosAppInstance } from '@shared/lib/axios';
import { AxiosPromise } from 'axios';
import { AppClient } from '@shared/lib/api/target/types/target';

export const TargetAPI = {
  getClients: async (): AxiosPromise<AppClient[]> => {
    return axiosAppInstance.get('/client');
  },
  updateClient: async (
    id: AppClient['id'],
    payload: Partial<Omit<AppClient, 'id' | 'created_at' | 'updated_at'>>,
  ): AxiosPromise<AppClient> => {
    return axiosAppInstance.patch(`/client/${id}`, payload);
  },
};
