import type { AxiosPromise } from 'axios';
import type {
  CompanyTemplate,
  CompanyTemplateTag,
  CreateCompanyTemplate,
} from '@shared/lib/api/target/types';
import { CreateCompanyTemplateTag } from '@shared/lib/api/target/types';
import { axiosAppInstance } from '@shared/lib/axios';

const BASE_URL = 'target/company-template';

export const CompanyTemplateAPI = {
  getAll: async (): AxiosPromise<CompanyTemplate[]> => {
    return axiosAppInstance.get(BASE_URL);
  },
  create: async (payload: CreateCompanyTemplate): AxiosPromise<CompanyTemplate> => {
    return axiosAppInstance.post(BASE_URL, payload);
  },
  delete: async (templateId: CompanyTemplate['id']): AxiosPromise => {
    return axiosAppInstance.delete(`${BASE_URL}/${templateId}`);
  },
  storeTags: async (
    templateId: CompanyTemplate['id'],
    payload: CreateCompanyTemplateTag,
  ): AxiosPromise<CompanyTemplateTag['tag'][]> => {
    return axiosAppInstance.post(`${BASE_URL}/${templateId}/tag`, payload);
  },
};
