import { IClient, initClientState } from '@entities/client';
import { IClientsStatsRes } from '@features/clientStats';
import { ISenlerStatsRes } from '@features/senlerStats';
import { TableData } from '@widgets/senler';

export const setTableData = (
  clientsStats: IClientsStatsRes[],
  senlerStats: ISenlerStatsRes[],
  clients: IClient[],
) => {
  const tableData: TableData[] = [];
  const collator = new Intl.Collator();

  clientsStats.map((clientStats) => {
    const senler = senlerStats.find((senler) => senler.client_id === clientStats.id);
    const client = clients.find((client) => client.id === clientStats.id);

    const spent = clientStats.stats.reduce((spent, stat) => {
      if (!stat.spent) return spent;
      return +stat.spent + +spent;
    }, 0);

    const spentPerSub =
      senler && senler.stats && senler.stats.count_subscribe
        ? spent / senler.stats.count_subscribe
        : 0;

    tableData.push({
      id: client ? client.id : initClientState.id,
      client_name: client ? client.name : initClientState.name,
      spent: spent,
      groupId: senler ? senler.group_id : 0,
      subscribers: senler && senler.stats ? senler.stats.count_subscribe : 0,
      success: senler && senler.stats ? senler.stats.success : false,
      spentPerSub: spentPerSub,
    });
  });
  return tableData.sort((a, b) => collator.compare(a.client_name, b.client_name));
};
