import { CampaignTemplate } from '@entities/campaign';
import { StatsRes } from '@entities/client';

export interface TableData_campaign {
  tableData: StatsRes[];
  tableTitle: CampaignTemplate['name'];
  id: string;
}
