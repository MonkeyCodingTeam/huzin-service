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
import { Client, ClientAPI, ClientsStatisticResponse, GetStatisticProps } from '@entities/client';
import { ClientGroupAPI, GetAllSubscribersCountResponse } from '@entities/group';
import {SenlerModal} from "@widgets/senler";

interface SenlerStats {
  client: Client;
  spent?: number;
  clicks?: number;
  subscribers?: number;
  groupId?: number;
  success: boolean;
  responsible?: { id: number; name: string };
}

const responsibleEmployees = [
  { id: 1, name: 'Анастасия' },
  { id: 2, name: 'Евгения' },
    { id: 4, name: 'Любовь' },
  { id: 3, name: 'Татьяна' },
];

const SenlerPage = () => {
  const [clientsWithSenler, setClientsWithSenler] = useState<SenlerStats[]>([]);

  const [clients, setClients] = useState<Client[]>([]);
  const [clientStats, setClientStats] = useState<ClientsStatisticResponse[]>([]);
  const [senlerSubs, setSenlerSubs] = useState<GetAllSubscribersCountResponse>([]);
  const [senlerStats, setSenlerStats] = useState<SenlerStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingSenler, setLoadingSenler] = useState(false);
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
        clicks: stat?.clicks || 0,
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
      only_field: ['spent', 'day_from', 'clicks'],
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

  const spentColorAlert = (stat: SenlerStats) => {
    if (loadingSenler) return '';

    if (stat.spent && stat.subscribers !== undefined) {
      const def = Math.round(stat.subscribers === 0 ? +stat.spent : +stat.spent / stat.subscribers);

      if (def > 75) {
        return css.container__table__column_danger;
      }

      if (def > 55) {
        return css.container__table__column_warning;
      }

      return css.container__table__column_success;
    }

    return '';
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
      only_field: ['clicks', 'spent'],
    }).then((res) => {
      if (!clients.length) return;

      ClientGroupAPI.getAllSubscribersCount({
        date_from,
        date_to,
      }).then((subs) => {
        const senler = subs.data;

        const stats = clients.map((client) => {
          const stat = res.data.find((stat) => stat.id === client.id);
          const spent = stat?.stats.reduce((spent, stat) => {
            return spent + (+stat.spent || 0);
          }, 0);
          const clicks = stat?.stats.reduce((click, stat) => {
            return click + (+stat.clicks || 0);
          }, 0);
          return {
            client,
            spent,
            clicks,
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

  const groupHeaderTemplate = (data: SenlerStats) => {
    if (!data) return '';
    return <span className={css.groupHeader}>{data.responsible ? data.responsible.name : ''}</span>;
  };

  const setResponsible = (stats: SenlerStats[]) => {
    const part = Math.ceil(stats.length / responsibleEmployees.length);
    let userIndex = 0;
    let count = 0;

    return stats.map((stat) => {
      if (count >= part) {
        count = 0;
        userIndex++;
      }
      count++;

      return {
        ...stat,
        responsible: responsibleEmployees[userIndex],
      };
    });
  };

  useEffect(() => {
    setClientsWithSenler(setResponsible(senlerStats.filter((stat) => stat.success)));
  }, [senlerStats]);

  return (
    <Transition className={css.container}>
      <TableLoader isLoading={loading}>
        <DataTable
          value={clientsWithSenler.length ? clientsWithSenler : senlerStats}
          selectionMode='single'
          sortField={'responsible.name'}
          sortOrder={1}
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
          rowGroupMode={loadingSenler || loadingStats || loading ? undefined : 'subheader'}
          groupRowsBy={'responsible.name'}
          rowGroupHeaderTemplate={groupHeaderTemplate}
          scrollable
          scrollHeight='calc(100% - 56px)'
          header={
            <div className={css.container__table__header}>
              <SenlerHeader
                filterChange={handleFilterChange}
                onWeekChange={handleWeekChange}
                onRangeChange={handleRangeChange}
              />
              <SenlerModal
                senlerStats={senlerStats.filter((stat) => !stat.success)}
                isLoading={loadingSenler || loadingStats || loading}
              />
            </div>
          }
        >
          <Column header='Клиенты' body={nameTemplate} />
          <Column header='Потрачено' body={spentTemplate} />
          <Column header='Подписки' body={subscribersTemplate} />
          <Column
            header='Цена подписки'
            body={spentPerSubTemplate}
            bodyClassName={spentColorAlert}
          />
          <Column
            header='Клики'
            body={(stat: SenlerStats) => {
              if (loadingStats) {
                return <Skeleton width='10rem' />;
              }
              return <span>{stat.clicks || 0}</span>;
            }}
          />
          <Column
            header='Цена клика'
            body={(stat: SenlerStats) => {
              if (loadingStats) {
                return <Skeleton width='10rem' />;
              }
              if (!stat.spent) return '-';
              return <span>{stat.clicks ? (stat.spent / stat.clicks).toFixed(2) : '-'}</span>;
            }}
          />
        </DataTable>
      </TableLoader>
    </Transition>
  );
};

export default SenlerPage;
