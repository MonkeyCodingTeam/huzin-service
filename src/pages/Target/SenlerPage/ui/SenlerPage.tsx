import { TableLoader, Transition } from '@widgets';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import css from './SenlerPage.module.scss';
import { ChangeEvent, useEffect, useState } from 'react';
import { FilterMatchMode } from 'primereact/api';
import { Period, SenlerHeader } from '@pages/Target/SenlerPage/ui/SenlerHeader/ui/SenlerHeader';
import { DateTime } from 'luxon';
import { Skeleton } from 'primereact/skeleton';
import { Link } from '@shared/ui';
import classNames from 'classnames';
import { Client, ClientAPI, ClientsStatisticResponse, GetStatisticProps } from '@entities/client';
import { ClientGroupAPI, GetAllSubscribersCountResponse } from '@entities/group';

interface SenlerStats {
  client: Client;
  spent?: number;
  subscribers?: number;
  groupId?: number;
  success: boolean;
}

const SenlerPage = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [clientStats, setClientStats] = useState<ClientsStatisticResponse[]>([]);
  const [senlerSubs, setSenlerSubs] = useState<GetAllSubscribersCountResponse>([]);
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
    getStatistics();
  }, []);

  useEffect(() => {
    if (week) {
      getSenlerStats({ date_from: week.startOf('week'), date_to: week.endOf('week') });
    }
  }, [week]);

  useEffect(() => {
    if (!clients.length) return;

    const stats = clients.map((client) => {
      const spent = clientStats.find((stat) => stat.id === client.id);
      const stat = spent?.stats
        ? spent.stats.find((stat) => stat.day_from === week?.toFormat('yyyyLLdd'))
        : null;
      return {
        client,
        spent: stat?.spent || 0,
        subscribers: senlerSubs[client.id]?.count_subscribe,
        groupId: senlerSubs[client.id]?.group_id,
        success: senlerSubs[client.id]?.success,
      };
    });
    setSenlerStats(stats);
  }, [clientStats, clients, week, senlerSubs]);

  const getClients = () => {
    ClientAPI.getClients().then((res) => {
      setClients(res.data);
      setLoading(false);
    });
  };

  const getStatistics = () => {
    setLoadingStats(true);
    ClientAPI.getAllStatistics({
      date_from: DateTime.now().minus({ month: 3 }),
      date_to: DateTime.now(),
      period: 'week',
      only_field: ['spent', 'day_from'],
    }).then((res) => {
      setClientStats(res.data);
      setLoadingStats(false);
    });
  };

  const getSenlerStats = ({ date_from, date_to }: Omit<Period, 'range'>) => {
    setLoadingSenler(true);
    ClientGroupAPI.getAllSubscribersCount({
      date_from,
      date_to,
    }).then((res) => {
      setSenlerSubs(res.data);
      setLoadingSenler(false);
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
  };

  const handleRangeChange = ({ date_from, date_to, range }: Period) => {
    setWeek(undefined);
    setLoadingStats(true);
    setLoadingSenler(true);
    ClientAPI.getAllStatistics({
      date_from,
      date_to,
      period: range as GetStatisticProps['period'],
      only_field: ['spent'],
    }).then((res) => {
      if (!clients.length) return;

      ClientGroupAPI.getAllSubscribersCount({
        date_from,
        date_to,
      }).then((subs) => {
        const senler = subs.data;

        const stats = clients.map((client) => {
          const spent = res.data.find((stat) => stat.id === client.id);
          console.log(spent);
          const stat = spent?.stats.reduce((spent, stat) => {
            return spent + (+stat.spent || 0);
          }, 0);
          return {
            client,
            spent: stat,
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
      <TableLoader isLoading={loading}>
        <DataTable
          value={senlerStats}
          selectionMode='single'
          sortField='success'
          sortOrder={-1}
          tableStyle={{
            borderCollapse: 'separate',
            alignItems: 'center',
          }}
          className={css.container__table}
          size='small'
          showGridlines
          key='id'
          filters={filters}
          globalFilterFields={['client.name']}
          rowGroupMode='subheader'
          groupRowsBy='success'
          rowGroupHeaderTemplate={groupHeaderTemplate}
          scrollable
          scrollHeight='calc(100% - 56px)'
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
      </TableLoader>
    </Transition>
  );
};

export default SenlerPage;
