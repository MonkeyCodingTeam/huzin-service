import { CampaignTemplateTag } from '@entities/campaign';

export interface updateCampaignTemplateTags {
  tags: Pick<CampaignTemplateTag, 'tag'>[];
}
