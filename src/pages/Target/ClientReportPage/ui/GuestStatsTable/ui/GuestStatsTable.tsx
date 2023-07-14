import { Client, ClientsStatisticResponse, StatisticResponse } from '@entities/client';
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
  company_template?: CompanyTemplate;
}

const monthCount = 6;

export const GuestStatsTable: FC<GuestStatsTableProps> = ({ client, company_template }) => {
  const [stats, setStats] = useState<StatisticResponse[]>([]);
  const [companyStats, setCompanyStats] = useState<ClientsStatisticResponse[]>([]);
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
      period: 'month',
      company_template_id: company_template?.id,
    }).then((res) => {
      setCompanyStats(res.data);
    });

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

  useEffect(() => {
    if (companyStats.length) {
      setStats(() => {
        setIsLoading(false);
        return sumStats(companyStats);
      });
    } else {
      setStats([]);
    }
  }, [companyStats]);

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

  return !isLoading ? (
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
      <Column header='Подписка Senler' field='senler' body={senlerCountBody} />
      <Column header='Цена подписки' body={senlerCostBody} />
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
