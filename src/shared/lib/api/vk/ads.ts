import { AdsClient } from '@shared/lib/api/vk/types/ads';
import { axiosVkInstance } from '@shared/lib/axios';
import { AxiosResponse } from '@shared/lib/api/vk/types/axios';

const METHOD = 'ads';
const ROUTES = {
  getClients: `${METHOD}.getClients`,
  getStatistics: `${METHOD}.getStatistics`,
};

export const AdsAPI = {
  getClients: async (): AxiosResponse<AdsClient[]> => {
    return axiosVkInstance.get(ROUTES.getClients, {
      params: {
        account_id: __VK_AGENCY__,
      },
    });
  },
  getStatistics: async (props: getStatisticsParams): AxiosResponse<unknown> => {
    const { ids, period, date_from, date_to } = props;
    return axiosVkInstance.get(ROUTES.getStatistics, {
      params: {
        account_id: __VK_AGENCY__,
        ids_type: 'client',
        ids,
        period,
        date_from,
        date_to,
      },
    });
  },
};

type getStatisticsParams = {
  ids: string;
  period: 'day' | 'week' | 'month' | 'year' | 'overall';
  date_from: string;
  date_to: string;
};
