export interface CampaignTemplateTag {
  id: number;
  tag: string;
}

export interface CampaignTemplate {
  id: number;
  name: string;
  tags: CampaignTemplateTag[];
  has_senler: 0 | 1;
}
