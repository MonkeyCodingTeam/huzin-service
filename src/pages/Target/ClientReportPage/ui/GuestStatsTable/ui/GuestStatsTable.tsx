import { Client } from '@entities/client';
import {
  CompanyTemplate,
  GetSubscribersCountResponse,
  PeriodStatistic,
} from '@shared/lib/api/target/types';
import { FC, useEffect, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { DateTime } from 'luxon';
import { Skeleton } from 'primereact/skeleton';
import { GuestAPI } from '@shared/lib/api/target/guest';
import { TableSkeleton } from '@shared/ui/Skeletons';
import { groupStatsByPeriod } from '@shared/lib/util/groupStatsByPeriod';
import logger from 'redux-logger';

interface GuestStatsTableProps {
  client?: Client;
  company_template?: CompanyTemplate;
}

const monthCount = 6;

export const GuestStatsTable: FC<GuestStatsTableProps> = ({ client, company_template }) => {
  const [stats, setStats] = useState<PeriodStatistic[]>([]);
  const [senlerStats, setSenlerStats] = useState<Record<string, GetSubscribersCountResponse>>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 10000);

    if (!client?.id) return;

    GuestAPI.getCompanyStats(client.id, {
      date_from: DateTime.now().minus({ month: monthCount - 1 }),
      date_to: DateTime.now(),
      metrics: ['base', 'uniques'],
      company_template_id: company_template?.id,
    }).then((res) => {
      setStats(groupStatsByPeriod(res.data, 'month'));
    });

    if (!client.group_id) return;
    GuestAPI.getSubscribersCountByPeriod(client.group_id!, {
      date_from: DateTime.now().minus({ month: monthCount - 1 }),
      date_to: DateTime.now(),
      period: 'month',
      company_template_id: company_template?.id,
    }).then((res) => {
      setSenlerStats(res.data);
    });

    return () => {
      clearTimeout(timeout);
    };
  }, []);

  const senlerCountBody = (value: PeriodStatistic) => {
    if (senlerStats === undefined) {
      return <Skeleton width='10rem' />;
    }
    const senler = senlerStats[value.date]?.count_subscribe;

    return senler || '-';
  };

  const senlerCostBody = (value: PeriodStatistic) => {
    if (senlerStats === undefined) {
      return <Skeleton width='10rem' />;
    }
    const senler = senlerStats[value.date]?.count_subscribe;

    return senler ? (value.spent / senler).toFixed(2) : '-';
  };

  return !isLoading ? (
    <DataTable value={stats} sortField='month' sortOrder={-1} emptyMessage='Нет данных'>
      <Column
        header='Месяц'
        field='month'
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
  ) : (
    <TableSkeleton rows={monthCount} columns={monthCount} />
  );
};
