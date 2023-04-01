export interface CompanyTemplate {
  id: number;
  name: string;
  tags: CompanyTemplateTag[];
}

export type CreateCompanyTemplate = Pick<CompanyTemplate, 'name'>;

export interface CompanyTemplateTag {
  id: number;
  tag: string;
}

export interface CreateCompanyTemplateTag {
  tags: Pick<CompanyTemplateTag, 'tag'>[];
}
