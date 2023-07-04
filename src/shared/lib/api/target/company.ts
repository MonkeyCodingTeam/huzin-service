import type { AxiosPromise } from 'axios';
import type {
  CompanyTemplate,
  CompanyTemplateTag,
  CreateCompanyTemplate,
} from '@shared/lib/api/target/types';
import { CreateCompanyTemplateTag } from '@shared/lib/api/target/types';
import { axiosTargetInstance } from '@shared/lib/axios';

const BASE_URL = 'company-template';

export const CompanyTemplateAPI = {
  getAll: async (): AxiosPromise<CompanyTemplate[]> => {
    return axiosTargetInstance.get(BASE_URL);
  },
  create: async (payload: CreateCompanyTemplate): AxiosPromise<CompanyTemplate> => {
    return axiosTargetInstance.post(BASE_URL, payload);
  },
  delete: async (templateId: CompanyTemplate['id']): AxiosPromise => {
    return axiosTargetInstance.delete(`${BASE_URL}/${templateId}`);
  },
  storeTags: async (
    templateId: CompanyTemplate['id'],
    payload: CreateCompanyTemplateTag,
  ): AxiosPromise<CompanyTemplateTag['tag'][]> => {
    return axiosTargetInstance.post(`${BASE_URL}/${templateId}/tag`, payload);
  },
};
