import {
  Client,
  ClientsStatisticResponse,
  GetStatisticByCompaniesProps,
  StatisticResponse,
} from '@entities/client';
import { FC, useCallback, useEffect, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { DateTime } from 'luxon';
import { Skeleton } from 'primereact/skeleton';
import { GuestAPI } from '@shared/lib/api/target/guest';
import { CompanyTemplate } from '@shared/lib/api/target/types';
import { GetSubscribersCountResponse } from '@entities/group';
import { sumStatsForPeriod } from '@shared/lib/util';

interface GuestStatsTableProps {
  client: Client;
  stats: ClientsStatisticResponse[];
  companyTemplate?: CompanyTemplate | null;
  withoutTemplate?: boolean;
  statsPayload: GetStatisticByCompaniesProps;
}

export const GuestStatsTable: FC<GuestStatsTableProps> = ({
  client,
  companyTemplate,
  stats,
  withoutTemplate = false,
  statsPayload,
}) => {
  const [senlerStats, setSenlerStats] = useState<Record<string, GetSubscribersCountResponse>>();
  const { period } = statsPayload;

  const senlerCountBody = (value: StatisticResponse) => {
    if (senlerStats === undefined) {
      return <Skeleton width='10rem' />;
    }
    if (!senlerStats[value.period]?.count_subscribe) {
      return '-';
    }
    return senlerStats[value.period].count_subscribe;
  };

  const senlerCostBody = (value: StatisticResponse) => {
    if (senlerStats === undefined) {
      return <Skeleton width='10rem' />;
    }
    if (!senlerStats[value.period]?.count_subscribe) {
      return '-';
    }
    const senler = senlerStats[value.period].count_subscribe;

    return senler && value.spent ? (value.spent / senler).toFixed(2) : '-';
  };

  const getStats = useCallback(() => {
    let result = [...stats];

    if (withoutTemplate) {
      const companies = client.companies.filter((company) => !company.company_template_id);
      result = result.filter((stat) => companies.find((company) => company.id === stat.id));
      return sumStatsForPeriod(result, statsPayload.period);
    }

    if (companyTemplate && companyTemplate.companies) {
      result = result.filter((stat) =>
        companyTemplate.companies?.some((company) => stat.id === company.id),
      );
    }

    return sumStatsForPeriod(result, statsPayload.period);
  }, [companyTemplate, stats]);

  const setDateToFormatDM = (dayFrom: string, dayTo: string) => {
    return `${DateTime.fromFormat(dayFrom, 'yyyymmdd').toFormat('dd.mm')} - ${DateTime.fromFormat(
      dayTo,
      'yyyymmdd',
    ).toFormat('dd.mm')}`;
  };

  const setDateToFormatM = (month: string) => {
    return DateTime.fromFormat(month, 'yyyy-LL').setLocale('ru').toFormat('LLLL');
  };

  useEffect(() => {
    if (!companyTemplate?.has_senler || !client.group_id) return;
    GuestAPI.getSubscribersCountByPeriod(client.group_id, {
      ...statsPayload,
      company_template_id: companyTemplate?.id,
    }).then(({ data }) => {
      setSenlerStats(data);
    });
  }, [statsPayload]);

  return (
    <DataTable
      value={getStats()}
      sortField='period'
      sortOrder={-1}
      emptyMessage='Нет данных'
      tableStyle={{ minWidth: '60rem' }}
    >
      <Column
        header={() => (period === 'week' ? 'Период' : 'Месяц')}
        field='period'
        style={{ fontWeight: 'bold' }}
        body={(value) => {
          if (period === 'week' && value.day_from) {
            return setDateToFormatDM(value.day_from, value.day_to);
          }
          if (period === 'month' && value.month) {
            return setDateToFormatM(value.month);
          }
        }}
      />
      <Column
        header='Затраты'
        field='spent'
        body={(value) => (value.spent ? Math.round(value.spent).toLocaleString() : '-')}
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
        body={(value) => (value.clicks ? Math.round(value.clicks).toLocaleString() : '-')}
      />
      <Column
        header='Цена клика'
        field='clicks_value'
        body={(value) =>
          value.spent && value.clicks ? (value.spent / value.clicks).toFixed(2) : '-'
        }
      />
      <Column
        header='Охват'
        field='reach'
        body={(value) => (value.reach ? Math.round(value.reach).toLocaleString() : '-')}
      />
      <Column
        header='Просмотры'
        field='impressions'
        body={(value) => (value.impressions ? Math.round(value.impressions).toLocaleString() : '-')}
      />
      <Column
        header='CTR'
        field='ctr'
        headerTooltip='Коэффициент кликабельности'
        headerTooltipOptions={{
          position: 'bottom',
        }}
      />
    </DataTable>
  );
};
