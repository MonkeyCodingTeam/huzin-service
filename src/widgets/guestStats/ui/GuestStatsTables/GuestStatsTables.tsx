import { Flex } from 'antd';
import { FC, useEffect, useMemo, useState } from 'react';
import { useLazyGetGuestCampaignTemplatesQuery } from '@entities/campaign';
import {
  Client,
  ClientStatsReq,
  StatsRes,
  sumStatsForPeriod,
  useLazyGetGuestClientStatsQuery,
} from '@entities/client';
import { EmptyBlock, SkeletonBlock } from '@shared/ui';
import { GuestStatsTable, monthPeriod, weekPeriod } from '@widgets/guestStats';
import { groupTableData } from '@widgets/guestStats/lib/groupTableData';
import { TableData_campaign } from '../../types/types';

interface Props {
  client?: Client;
  period: ClientStatsReq['period'];
}

type PeriodType = Record<ClientStatsReq['period'], Omit<ClientStatsReq, 'id'>>;

const periodType: PeriodType = { month: monthPeriod, week: weekPeriod };

export const GuestStatsTables: FC<Props> = ({ client, period }) => {
  const [getStats, { data: stats = [], isFetching: statsIsFetching }] =
    useLazyGetGuestClientStatsQuery();
  const [getCampaigns, { data: campaignsTemps = [], isFetching: campaignsIsFetching }] =
    useLazyGetGuestCampaignTemplatesQuery();
  // TODO SENLER
  // const [getSenler, { data: senler, isFetching: senlerIsFetching }] =
  //   useLazyGetGuestSenlerStatsQuery();

  const [tableDataWithCampaign, setTableDataWithCampaign] = useState<TableData_campaign[]>([]);
  const [tableDataWithoutCampaign, setTableDataWithoutCampaign] = useState<StatsRes[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!client?.id || !period) return;
    getCampaigns({ clientId: client.id }, true);
    getStats({ ...periodType[period], id: client.id }, true);

    // TODO SENLER
    // if (period && client && client.group_id)
    //   getSenler({ params: monthPeriod, groupId: client.group_id });
  }, [period, client]);

  const groupedData = useMemo(() => {
    return groupTableData(stats, campaignsTemps);
  }, [stats, campaignsTemps]);

  useEffect(() => {
    if (!groupedData) return;
    if (groupedData.withoutCampaign.length) {
      setTableDataWithoutCampaign(sumStatsForPeriod(groupedData.withoutCampaign));
    }
    if (groupedData.withCampaign.length) {
      setTableDataWithCampaign(groupedData.withCampaign);
    }
  }, [groupedData]);

  useEffect(() => {
    setIsLoading(statsIsFetching || campaignsIsFetching);
  }, [statsIsFetching, campaignsIsFetching]);

  if (isLoading) return <SkeletonBlock />;
  if (!isLoading && !stats.length) return <EmptyBlock />;
  return (
    <Flex gap={16} vertical>
      <GuestStatsTable tableData={sumStatsForPeriod(stats)} title={'Другие компании'} />
      <GuestStatsTable
        tableDataCampaigns={tableDataWithCampaign}
        title={'Рекламные компании'}
        titleMarginBottom={'0'}
      />
      <GuestStatsTable tableData={tableDataWithoutCampaign} title={'Общая статистика'} />
    </Flex>
  );
};
