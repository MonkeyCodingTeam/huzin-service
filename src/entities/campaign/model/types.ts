import { Client } from '@entities/client/@x/campaign';

export interface CampaignTemplateTag extends Model {
  tag: string;
}

export interface CampaignTemplate {
  id: number;
  name: string;
  tags: CampaignTemplateTag[];
  has_senler: boolean;
  companies?: Campaign[];
}

export interface Campaign extends Model {
  name: string;
  client_id: Client['id'];
  status: 0 | 1 | 2;
  company_template_id: CampaignTemplate['id'];
}
