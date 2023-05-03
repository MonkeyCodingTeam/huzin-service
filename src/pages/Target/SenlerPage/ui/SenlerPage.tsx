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

interface SenlerStats {
  client: Client;
  spent?: number;
  subscribers?: number;
  groupId?: number;
  success: boolean;
}

const SenlerPage = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [senlerStats, setSenlerStats] = useState<SenlerStats[]>([]);
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
    getClients();
  }, []);

  useEffect(() => {
    if (week) {
      handleRangeChange(week.startOf('week'), week.endOf('week'));
    }
  }, [week]);

  const getClients = () => {
    ClientAPI.getClients().then((res) => {
      setClients(res.data);
      const clients = res.data.map((client) => ({ client, success: false }));
      setSenlerStats(clients);
      setLoading(false);
    });
  };

  const nameTemplate = (stat: SenlerStats) => {
    return (
      <Link
        className={css.table__column_name}
        target='_blank'
        href={`https://vk.com/ads?act=office&union_id=${stat.client.id}`}
      >
        {stat.client.name}
      </Link>
    );
  };
  const spentTemplate = (stat: SenlerStats) => {
    if (loadingStats) {
      return <Skeleton width='10rem' />;
    }
    return <span>{stat.spent ? Math.trunc(stat.spent).toLocaleString() : 0}</span>;
  };

  const subscribersTemplate = (stat: SenlerStats) => {
    if (loadingSenler) {
      return <Skeleton width='12rem' />;
    }
    if (!stat.groupId || !stat.success) {
      const message = !stat.groupId ? 'Добавьте группу' : 'Проверьте ключ Senler';
      return <Link href={`/target/settings/client/${stat.client.id}`}>{message}</Link>;
    }
    return <span>{stat.subscribers ? stat.subscribers.toLocaleString() : '-'}</span>;
  };

  const spentPerSubTemplate = (stat: SenlerStats) => {
    if (loadingSenler) {
      return <Skeleton width='5rem' />;
    }
    if (stat.spent && stat.subscribers !== undefined) {
      return (
        <span>
          {(stat.subscribers === 0 ? +stat.spent : +stat.spent / stat.subscribers).toFixed(2)}
        </span>
      );
    }
    return <span>-</span>;
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
      console.log(res);
      if (!clients.length) return;

      GroupAPI.getAllSubscribersCount({
        date_from,
        date_to,
      }).then((subs) => {
        const senler = subs.data;
        const stats = clients.map((client) => {
          const spent = res.data.find((stat) => stat.id === client.id);
          return {
            client,
            spent: spent?.total.spent || 0,
            subscribers: senler[client.id]?.count_subscribe,
            groupId: senler[client.id]?.group_id,
            success: !!senler[client.id]?.success,
          };
        });
        setSenlerStats(stats);
        setLoadingSenler(false);
        setLoadingStats(false);
      });
    });
  };

  const groupHeaderTemplate = (stat: SenlerStats) => {
    return (
      <span
        className={classNames(css.groupHeader, !stat.subscribers ? css.groupHeader__warning : '')}
      >
        Senler {stat.success ? 'указан' : 'не указан'}
      </span>
    );
  };

  return (
    <Transition className={css.container}>
      {loading ? (
        <TableSkeleton rows={10} columns={6} style={{ width: '100%' }} />
      ) : (
        <DataTable
          value={senlerStats}
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
