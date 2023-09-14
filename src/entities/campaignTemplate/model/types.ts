export interface ICampaignTemplateTag {
  id: number;
  tag: string;
}

export interface ICampaignTemplate {
  id: number;
  name: string;
  tags: ICampaignTemplateTag[];
  has_senler: 0 | 1;
}
