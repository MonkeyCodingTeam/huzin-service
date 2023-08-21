import { Client, ClientsStatisticResponse, StatisticResponse } from '@entities/client';
import { FC, useCallback, useEffect, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { DateTime } from 'luxon';
import { Skeleton } from 'primereact/skeleton';
import { GuestAPI } from '@shared/lib/api/target/guest';
import { CompanyTemplate } from '@shared/lib/api/target/types';
import { GetSubscribersCountResponse } from '@entities/group';
import { sumStats } from '@shared/lib/util';

interface GuestStatsTableProps {
  client: Client;
  stats: ClientsStatisticResponse[];
  companyTemplate?: CompanyTemplate | null;
  withoutTemplate?: boolean;
}

const monthCount = 6;

export const GuestStatsTable: FC<GuestStatsTableProps> = ({
  client,
  companyTemplate,
  stats,
  withoutTemplate = false,
}) => {
  const [senlerStats, setSenlerStats] = useState<Record<string, GetSubscribersCountResponse>>();

  useEffect(() => {
    if (!companyTemplate?.has_senler || !client.group_id) return;

    GuestAPI.getSubscribersCountByPeriod(client.group_id, {
      date_from: DateTime.now().minus({ month: monthCount - 1 }),
      date_to: DateTime.now(),
      period: 'month',
      company_template_id: companyTemplate?.id,
    }).then(({ data }) => {
      setSenlerStats(data);
    });
  }, []);

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

  const getStats = useCallback(() => {
    let result = [...stats];

    if (companyTemplate === null) {
      const companies = client.companies.filter((company) => !company.company_template_id);
      result = result.filter((stat) => companies.find((company) => company.id === stat.id));
    }

    if (companyTemplate && companyTemplate.companies) {
      result = result.filter((stat) =>
        companyTemplate.companies?.some((company) => stat.id === company.id),
      );
    }

    return sumStats(result);
  }, [companyTemplate, stats]);

  return (
    <DataTable value={getStats()} sortField='month' sortOrder={-1} emptyMessage='Нет данных'>
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
        hidden={!companyTemplate?.has_senler || !client.group_id}
        header='Подписка Senler'
        field='senler'
        body={senlerCountBody}
      />
      <Column
        hidden={!companyTemplate?.has_senler || !client.group_id}
        header='Цена подписки'
        body={senlerCostBody}
      />
      <Column
        header='Клики'
        field='clicks'
        body={(value) => Math.round(value.clicks).toLocaleString()}
      />
      <Column
        header='Цена клика'
        field='clicks_value'
        body={(value) => (value.clicks ? (value.spent / value.clicks).toFixed(2) : '-')}
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
