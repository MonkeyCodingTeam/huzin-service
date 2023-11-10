import { CampaignTemplate } from '@entities/campaign';
import { ClientStatsRes, StatsRes, sumStatsForPeriod } from '@entities/client';

interface TableData_campaign {
  tableData: StatsRes[];
  tableTitle: CampaignTemplate['name'];
  id: string;
}

export const groupTableData = (stats: ClientStatsRes[], campaignsTemps: CampaignTemplate[]) => {
  if (!stats.length && !campaignsTemps.length) return;

  const result: TableData_campaign[] = [];
  const statsCopy = [...stats];
  campaignsTemps.forEach((template) => {
    if (!template.companies) return;
    const { companies } = template;

    const filtered = statsCopy.filter((stat, index) =>
      companies?.some((company) => {
        if (stat.id !== company.id) return false;
        statsCopy.splice(index, 1);
        return true;
      }),
    );

    const sumStats = sumStatsForPeriod(filtered);
    if (!sumStats.length) return;
    result.push({
      id: `campaign${template.id}`,
      tableData: sumStats,
      tableTitle: template.name,
    });
  });
  return { withCampaign: result, withoutCampaign: statsCopy };
};
