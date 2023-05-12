import { Transition } from '@widgets';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import css from './SenlerPage.module.scss';
import { ChangeEvent, useEffect, useState } from 'react';
import { FilterMatchMode } from 'primereact/api';
import { Period, SenlerHeader } from '@pages/Target/SenlerPage/ui/SenlerHeader/ui/SenlerHeader';
import { DateTime } from 'luxon';
import { ClientAPI } from '@shared/lib/api';
import { GroupAPI } from '@shared/lib/api/target/group';
import { TableSkeleton } from '@shared/ui/Skeletons';
import { Skeleton } from 'primereact/skeleton';
import { Link } from '@shared/ui';
import classNames from 'classnames';
import { Client } from '@entities/client';
import { GetAllSubscribersCountResponse, Statistic } from '@shared/lib/api/target/types';

const SenlerPage = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [senlerStats, setSenlerStats] = useState<GetAllSubscribersCountResponse>({});
  const [stats, setStats] = useState<Statistic[]>();
  const [loading, setLoading] = useState(true);
  const [loadingSenler, setLoadingSenler] = useState(true);
  const [loadingStats, setLoadingStats] = useState(true);
  const [week, setWeek] = useState<DateTime>();
  const [filters, setFilters] = useState<
    Record<string, { value: string; matchMode: FilterMatchMode }>
  >({
    global: { value: '', matchMode: FilterMatchMode.CONTAINS },
  });

  const handleFilterChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const _filters = { ...filters };

    _filters['global'].value = value;

    setFilters(_filters);
  };

  useEffect(() => {
    ClientAPI.getClients().then((res) => {
      setClients(res.data);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (week) {
      handleRangeChange(week.startOf('week'), week.endOf('week'));
    }
  }, [week]);

  const nameTemplate = (client: Client) => {
    return (
      <Link
        className={css.table__column_name}
        target='_blank'
        href={`https://vk.com/ads?act=office&union_id=${client.id}`}
      >
        {client.name}
      </Link>
    );
  };
  const spentTemplate = (client: Client) => {
    const spent = stats?.find((item) => item.id === client.id)?.total.spent;
    if (loadingStats) {
      return <Skeleton width='10rem' />;
    }
    return <span>{spent ? Math.trunc(spent).toLocaleString() : 0}</span>;
  };

  const subscribersTemplate = (client: Client) => {
    const senlerStat = senlerStats[client.id];
    if (loadingSenler) {
      return <Skeleton width='12rem' />;
    }
    if (!senlerStat) {
      return '-';
    }
    if (!senlerStat.group_id || !senlerStat.success) {
      const message = !senlerStat.group_id ? 'Добавьте группу' : 'Проверьте ключ Senler';
      return <Link href={`/target/settings/client/${client.id}`}>{message}</Link>;
    }
    return senlerStat.count_subscribe.toLocaleString();
  };

  const spentPerSubTemplate = (client: Client) => {
    const senlerStat = senlerStats[client.id];
    const spent = stats?.find((item) => item.id === client.id)?.total.spent;
    if (loadingSenler) {
      return <Skeleton width='12rem' />;
    }
    if (!senlerStat || !spent) {
      return '-';
    }
    return (
      senlerStat.count_subscribe === 0 ? +spent : +spent / senlerStat.count_subscribe
    ).toFixed(2);
  };

  const handleWeekChange = (weekStart: DateTime) => {
    setWeek(weekStart);
    if (weekStart) {
      handleRangeChange(weekStart.startOf('week'), weekStart.endOf('week'));
    }
  };

  const handleRangeChange = (date_from: Period['date_from'], date_to: Period['date_to']) => {
    setWeek(undefined);
    setLoadingStats(true);
    setLoadingSenler(true);
    ClientAPI.getAllStatistics({
      date_from,
      date_to,
      only_field: ['spent'],
    }).then((res) => {
      console.log(res.data);
      if (!clients.length) return;
      setStats(res.data);
      setLoadingStats(false);
    });
    GroupAPI.getAllSubscribersCount({
      date_from,
      date_to,
    }).then((res) => {
      setSenlerStats(res.data);
      setLoadingSenler(false);
    });
  };

  const groupHeaderTemplate = (client: Client) => {
    return (
      <span
        className={classNames(
          css.groupHeader,
          !senlerStats[client.id] ? css.groupHeader__warning : '',
        )}
      >
        Senler {senlerStats[client.id] ? 'указан' : 'не указан'}
      </span>
    );
  };

  return (
    <Transition className={css.container}>
      {loading ? (
        <TableSkeleton rows={10} columns={6} style={{ width: '100%' }} />
      ) : (
        <DataTable
          value={clients}
          selectionMode='single'
          sortField='success'
          sortOrder={-1}
          tableStyle={{
            borderCollapse: 'separate',
            alignItems: 'center',
          }}
          className={css.table}
          size='small'
          showGridlines
          rows={10}
          key='id'
          filters={filters}
          globalFilterFields={['client.name']}
          rowGroupMode='subheader'
          groupRowsBy='success'
          rowGroupHeaderTemplate={groupHeaderTemplate}
          header={
            <SenlerHeader
              filterChange={handleFilterChange}
              onWeekChange={handleWeekChange}
              onRangeChange={handleRangeChange}
            />
          }
        >
          <Column header='Клиенты' body={nameTemplate} />
          <Column header='Потрачено' body={spentTemplate} />
          <Column header='Подписки' body={subscribersTemplate} />
          <Column header='Цена подписки' body={spentPerSubTemplate} />
        </DataTable>
      )}
    </Transition>
  );
};

export default SenlerPage;
