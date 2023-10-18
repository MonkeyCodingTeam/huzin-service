import { axiosTargetInstance } from '@shared/lib/axios';
import { AxiosPromise } from 'axios';
import { MonitoringType } from '../model/monitoring_type';
import { Client } from '@entities/client';

export const MonitoringTypeAPI = {
  get: async (): AxiosPromise<MonitoringType[]> => axiosTargetInstance.get('monitoring_type'),
  set: async (
    clientId: Client['id'],
    monitoringTypeId: MonitoringType['id'],
  ): AxiosPromise<Client> =>
    axiosTargetInstance.patch(`client/${clientId}/monitoring_type/${monitoringTypeId}`),
};
