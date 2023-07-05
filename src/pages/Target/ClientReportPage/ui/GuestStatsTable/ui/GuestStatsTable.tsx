import { Client, PeriodStatistic } from '@entities/client';
import { FC, useEffect, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { DateTime } from 'luxon';
import { Skeleton } from 'primereact/skeleton';
import { GuestAPI } from '@shared/lib/api/target/guest';
import { GetSubscribersCountResponse } from '@entities/group';
import { CompanyTemplate } from '@shared/lib/api/target/types';

interface GuestStatsTableProps {
  stats: PeriodStatistic[];
  monthCount: number;
  client?: Client;
  company_template?: CompanyTemplate;
}

export const GuestStatsTable: FC<GuestStatsTableProps> = ({
  client,
  company_template,
  stats,
  monthCount,
}) => {
  const [senlerStats, setSenlerStats] = useState<Record<string, GetSubscribersCountResponse>>();
  const [isSenlerLoading, setIsSenlerLoading] = useState(true);

  useEffect(() => {
    if (!client?.group_id) return;
    GuestAPI.getSubscribersCountByPeriod(client.group_id!, {
      date_from: DateTime.now().minus({ month: monthCount }),
      date_to: DateTime.now(),
      period: 'month',
      company_template_id: company_template?.id,
    })
      .then((res) => {
        setSenlerStats(res.data);
      })
      .finally(() => {
        setIsSenlerLoading(false);
      });
  }, []);

  const senlerCountBody = (value: PeriodStatistic) => {
    if (isSenlerLoading) {
      return <Skeleton width='10rem' />;
    }

    if (senlerStats === undefined) {
      return '-';
    }

    return senlerStats[value.date]?.count_subscribe || '-';
  };

  const senlerCostBody = (value: PeriodStatistic) => {
    if (isSenlerLoading) {
      return <Skeleton width='10rem' />;
    }

    if (senlerStats === undefined) {
      return '-';
    }

    if (!senlerStats[value.date]?.count_subscribe) {
      return '-';
    }
    const senler = senlerStats[value.date]?.count_subscribe;

    return senler ? (value.spent / senler).toFixed(2) : '-';
  };

  return (
    <DataTable value={stats} sortField='date' sortOrder={-1} emptyMessage='Нет данных'>
      <Column
        header='Месяц'
        field='date'
        style={{ fontWeight: 'bold' }}
        body={(value) => {
          return DateTime.fromFormat(value.date, 'yyyy-MM').setLocale('ru').toFormat('LLLL');
        }}
      />
      <Column
        header='Затраты'
        field='spent'
        body={(value) => Math.round(value.spent).toLocaleString()}
      />
      <Column header='Подписка Senler' field='senler' body={senlerCountBody} />
      <Column header='Цена подписки' body={senlerCostBody} />
      <Column
        header='Просмотры'
        field='shows'
        body={(value) => Math.round(value.shows).toLocaleString()}
      />
      <Column
        header='Клики'
        field='clicks'
        body={(value) => Math.round(value.clicks).toLocaleString()}
      />
    </DataTable>
  );
};
