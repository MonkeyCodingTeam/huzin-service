import { ClientAdsTable, DataType, ErrorsModal } from '@feature/ads';
import { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { Client, ClientAPI } from '@entities/client';
import css from '@feature/ads/ui/ClientAdsTable/ClientAdsTable.module.scss';
import { Period, SenlerHeader } from '../SenlerPage/ui/SenlerHeader';
import { DateTime } from 'luxon';
import { Ads } from '@entities/ads';

const selectedClintIds: number[] = [1608290902];
interface DatePeriod {
  start: DateTime;
  end: DateTime;
}

export const AdsPage = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClients, setSelectedClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState<DatePeriod>();
  const [errors, setErrors] = useState<Ads[]>([]);
  const [data, setData] = useState<DataType[]>([]);
  const [filter, setFilter] = useState('');

  const reformatClients = (clients: Client[], period: DatePeriod): DataType[] => {
    return clients.map((client: Client) => {
      const adsCount =
        client.ads?.filter((ads) => {
          const published_at = DateTime.fromSQL(ads.published_at);
          return published_at >= period.start && published_at <= period.end;
        }).length || 0;
      return {
        key: client.id,
        name: client.name,
        adsCount,
        activeAdsDif: `${client.ads?.filter((ad) => ad.is_active).length}`,
      };
    });
  };

  useEffect(() => {
    setErrors(
      clients.reduce<Ads[]>((prev, { ads }) => {
        if (!ads) return prev;

        ads.forEach((ad) => {
          if (!ad.error) return;

          prev.push(ad);
        });
        return prev;
      }, []),
    );

    if (!date) return;
    setData(reformatClients(clients, date));
  }, [clients]);

  useEffect(() => {
    ClientAPI.getClients({ with: ['ads'] })
      .then(({ data }) => {
        setClients(data);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!date) return;

    changeDataByRange(date?.start, date?.end);
  }, [date, clients]);

  const handleSearch = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setFilter(e.currentTarget.value);
  }, []);

  const changeDataByRange = useCallback(
    (start: DateTime, end: DateTime) => {
      const startDay = start.startOf('day');
      const endDay = end.endOf('day');

      setData(reformatClients(clients, { start: startDay, end: endDay }));
    },
    [clients],
  );
  const handleWeekChange = (weekStart: DateTime) => {
    const start = weekStart.startOf('week');
    const end = weekStart.endOf('week');

    setDate({ start, end });
  };

  const handleRangeDateChange = (range: Period) => {
    const { date_from, date_to } = range;

    setDate({ start: date_from, end: date_to });
  };

  const getFilteredData = useCallback(
    (filterData: DataType[], selected = false) => {
      const dataToFilter = filterData.filter((item) => {
        return selectedClintIds.find((clientId) => {
          return selected ? clientId === item.key : clientId !== item.key;
        });
      });

      if (!filter.length) return dataToFilter;

      return dataToFilter.filter((client) => {
        return client.name.toLowerCase().match(filter);
      });
    },
    [filter],
  );

  return (
    <div>
      <div className={css.container__header}>
        <SenlerHeader
          filterChange={handleSearch}
          onWeekChange={handleWeekChange}
          onRangeChange={handleRangeDateChange}
        />
        <ErrorsModal errors={errors} />
      </div>
      <ClientAdsTable data={getFilteredData(data)} loading={loading} />
      <ClientAdsTable data={getFilteredData(data, true)} loading={loading} />
    </div>
  );
};
