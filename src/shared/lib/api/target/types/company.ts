import { Company } from '@entities/company';

export interface CompanyTemplate {
  id: number;
  name: string;
  tags: CompanyTemplateTag[];
  has_senler: 0 | 1;

  companies?: Company[];
}

export type CreateCompanyTemplate = Pick<CompanyTemplate, 'name'>;

export interface CompanyTemplateTag {
  id: number;
  tag: string;
}

export interface CreateCompanyTemplateTag {
  tags: Pick<CompanyTemplateTag, 'tag'>[];
}
