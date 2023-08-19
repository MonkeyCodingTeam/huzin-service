import { Client, StatisticResponse } from '@entities/client';
import { FC, useEffect, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { DateTime } from 'luxon';
import { Skeleton } from 'primereact/skeleton';
import { GuestAPI } from '@shared/lib/api/target/guest';
import { TableSkeleton } from '@shared/ui/Skeletons';
import { CompanyTemplate } from '@shared/lib/api/target/types';
import { GetSubscribersCountResponse } from '@entities/group';
import { sumStats } from '@shared/lib/util';

interface GuestStatsTableProps {
  client?: Client;
  companyTemplate?: CompanyTemplate;
}

const monthCount = 6;

export const GuestStatsTable: FC<GuestStatsTableProps> = ({ client, companyTemplate }) => {
  const [stats, setStats] = useState<StatisticResponse[]>([]);
  const [senlerStats, setSenlerStats] = useState<Record<string, GetSubscribersCountResponse>>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([companyStatsPromise, subsCountPromise])
      .then(([companyStat, subsCountStat]) => {
        setStats(sumStats(companyStat.data));
        setSenlerStats(subsCountStat.data);
      })
      .finally(() => setIsLoading(false));
  }, []);

  if (!client?.id) return <></>;

  const companyStatsPromise = GuestAPI.getCompanyStats(client.id, {
    date_from: DateTime.now().minus({ month: monthCount - 1 }),
    date_to: DateTime.now(),
    period: 'month',
    company_templates: companyTemplate?.id ? [companyTemplate?.id] : [],
  });

  const subsCountPromise = companyTemplate?.has_senler
    ? GuestAPI.getSubscribersCountByPeriod(client.group_id!, {
        date_from: DateTime.now().minus({ month: monthCount - 1 }),
        date_to: DateTime.now(),
        period: 'month',
        company_template_id: companyTemplate?.id,
      })
    : { data: undefined };

  const senlerCountBody = (value: StatisticResponse) => {
    if (senlerStats === undefined) {
      return <Skeleton width='10rem' />;
    }
    if (!senlerStats[value.month]?.count_subscribe) {
      return '-';
    }
    return senlerStats[value.month].count_subscribe;
  };

  const senlerCostBody = (value: StatisticResponse) => {
    if (senlerStats === undefined) {
      return <Skeleton width='10rem' />;
    }
    if (!senlerStats[value.month]?.count_subscribe) {
      return '-';
    }
    const senler = senlerStats[value.month].count_subscribe;

    return senler ? (value.spent / senler).toFixed(2) : '-';
  };

  if (isLoading) return <TableSkeleton rows={monthCount} columns={monthCount} />;

  return (
    <DataTable value={stats} sortField='month' sortOrder={-1} emptyMessage='Нет данных'>
      <Column
        header='Месяц'
        field='month'
        style={{ fontWeight: 'bold' }}
        body={(value) => {
          return DateTime.fromFormat(value.month, 'yyyy-LL').setLocale('ru').toFormat('LLLL');
        }}
      />
      <Column
        header='Затраты'
        field='spent'
        body={(value) => Math.round(value.spent).toLocaleString()}
      />
      <Column
        hidden={!companyTemplate?.has_senler}
        header='Подписка Senler'
        field='senler'
        body={senlerCountBody}
      />
      <Column hidden={!companyTemplate?.has_senler} header='Цена подписки' body={senlerCostBody} />
      <Column
        header='Клики'
        field='clicks'
        body={(value) => Math.round(value.clicks).toLocaleString()}
      />
      <Column
        header='Цена клика'
        field='clicks_value'
        body={(value) => (value.clicks ? (value.spent / value.clicks).toPrecision(2) : '-')}
      />
      <Column
        header='Охват'
        field='reach'
        body={(value) => Math.round(value.reach).toLocaleString()}
      />
      <Column
        header='Просмотры'
        field='impressions'
        body={(value) => Math.round(value.impressions).toLocaleString()}
      />
    </DataTable>
  );
};
