import { Flex } from 'antd';
import { FC, useEffect, useMemo, useState } from 'react';
import { useLazyGetGuestCampaignTemplatesQuery } from '@entities/campaign';
import {
  Client,
  ClientStatsReq,
  StatsRes,
  sumStatsForPeriod,
  useLazyGetGuestClientStatsQuery,
  useLazyGetGuestSenlerStatsQuery,
} from '@entities/client';
import { SkeletonBlock } from '@shared/ui';
import { GuestStatsTableWrapper, monthPeriod, weekPeriod } from '@widgets/guestStats';
import { groupTableData } from '@widgets/guestStats/lib/groupTableData';
import { TableData_campaign } from '../../types/types';

interface Props {
  client?: Client;
  period?: ClientStatsReq['period'];
}

export const GuestStatsTables: FC<Props> = ({ client, period }) => {
  const [getStats, { data: stats = [], isFetching: statsIsFetching }] =
    useLazyGetGuestClientStatsQuery();
  const [getCampaigns, { data: campaignsTemps = [], isFetching: campaignsIsFetching }] =
    useLazyGetGuestCampaignTemplatesQuery();
  // TODO SENLER
  const [getSenler, { data: senler, isFetching: senlerIsFetching }] =
    useLazyGetGuestSenlerStatsQuery();

  const [tableDataWithCampaign, setTableDataWithCampaign] = useState<TableData_campaign[]>([]);
  const [tableDataWithoutCampaign, setTableDataWithoutCampaign] = useState<StatsRes[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!client?.id || !period) return;
    getCampaigns({ clientId: client.id }, true);
    // TODO SENLER
    // if (period && client && client.group_id)
    //   getSenler({ params: monthPeriod, groupId: client.group_id });

    switch (period) {
      case 'month':
        getStats({ ...monthPeriod, id: client.id }, true);
        break;
      case 'week':
        getStats({ ...weekPeriod, id: client.id }, true);
        break;
    }
  }, [period, client]);

  const groupedData = useMemo(() => {
    return groupTableData(stats, campaignsTemps);
  }, [stats, campaignsTemps, period]);

  // TODO Переделать
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
    setIsLoading(statsIsFetching || campaignsIsFetching || senlerIsFetching);
  }, [statsIsFetching, campaignsIsFetching, senlerIsFetching]);

  if (isLoading || !client) return <SkeletonBlock />;
  return (
    <Flex gap={16} vertical>
      <GuestStatsTableWrapper
        tableData={sumStatsForPeriod(stats)}
        isLoading={isLoading}
        title={'Другие компании'}
      />
      <GuestStatsTableWrapper
        tableDataCampaigns={tableDataWithCampaign}
        isLoading={isLoading}
        title={'Рекламные компании'}
        titleMarginBottom={'0'}
      />
      <GuestStatsTableWrapper
        tableData={tableDataWithoutCampaign}
        isLoading={isLoading}
        title={'Общая статистика'}
      />
    </Flex>
  );
};
