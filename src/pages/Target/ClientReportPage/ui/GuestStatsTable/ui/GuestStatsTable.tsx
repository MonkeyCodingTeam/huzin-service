import { Client } from '@entities/client';
import {
  ClientsStatisticResponse,
  CompanyTemplate,
  StatisticResponse,
} from '@shared/lib/api/target/types';
import { FC, useEffect, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { DateTime } from 'luxon';
import { Skeleton } from 'primereact/skeleton';
import { Company } from '@entities/company';
import { GuestAPI } from '@shared/lib/api/target/guest';
import { TableSkeleton } from '@shared/ui/Skeletons';

interface GuestStatsTableProps {
  client?: Client;
  company_template?: CompanyTemplate;
}

const monthCount = 6;
const fields: (keyof Pick<StatisticResponse, 'spent' | 'impressions' | 'clicks' | 'reach'>)[] = [
  'spent',
  'impressions',
  'clicks',
  'reach',
];

export const GuestStatsTable: FC<GuestStatsTableProps> = ({ client, company_template }) => {
  const [stats, setStats] = useState<StatisticResponse[]>([]);
  const [companyStats, setCompanyStats] = useState<ClientsStatisticResponse[]>();

  useEffect(() => {
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
      setStats((prevState) => {
        return prevState.map((stat) => {
          const date = DateTime.fromFormat(stat.month, 'yyyy-LL').toFormat('yyyy-LL-dd');
          return {
            ...stat,
            senler: res.data[date]?.count_subscribe | 0,
          };
        });
      });
    });
  }, []);

  useEffect(() => {
    if (companyStats) {
      setStats(() => getStatByCompany(companyStats));
    }
  }, [companyStats]);

  const getStatByCompany = (
    stats: ClientsStatisticResponse[],
    filter: Company[] = [],
  ): StatisticResponse[] => {
    const result: Record<StatisticResponse['month'], StatisticResponse> = {};
    stats.forEach((company) => {
      if (filter.length && !filter.find((item) => item.id === company.id)) {
        return;
      }
      company.stats.forEach((stat) => {
        if (result[stat.month]) {
          fields.forEach((field) => {
            (result[stat.month][field] as number) =
              (+result[stat.month][field] || 0) + (+stat[field] || 0);
          });
        } else {
          result[stat.month] = { ...stat };
        }
      });
    }, {});
    return Object.values(result);
  };

  if (!client) {
    return <Skeleton />;
  }
  const senlerCostBody = (value: StatisticResponse) => {
    if (value.senler === undefined) {
      return <Skeleton width='10rem' />;
    }
    return value.senler ? (value.spent / value.senler).toFixed(2) : '-';
  };

  return stats.length ? (
    <DataTable value={stats} sortField='month' sortOrder={-1}>
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
        header='Подписка Senler'
        field='senler'
        body={(value) => (value.senler === undefined ? <Skeleton width='5rem' /> : value.senler)}
      />
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
