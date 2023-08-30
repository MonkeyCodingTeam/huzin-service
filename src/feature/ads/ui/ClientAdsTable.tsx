import { Table } from 'antd';
import { ChangeEvent, FC, useCallback, useEffect, useRef, useState } from 'react';
import { Client } from '@entities/client';
import { ColumnsType } from 'antd/es/table';
import { Ads } from '@entities/ads';
import { Period, SenlerHeader } from '@pages/Target/SenlerPage/ui/SenlerHeader';
import { DateTime } from 'luxon';
import css from './ClientAdsTable.module.scss';
import { ErrorsModal } from '@feature/ads/ui/ErrorsModal/ErrorsModal';

interface DataType {
  key: number;
  name: Client['name'];
  adsCount: number;
}

const columns: ColumnsType<DataType> = [
  {
    title: 'Клиента',
    dataIndex: 'name',
    fixed: true,
  },
  {
    title: 'Количество компаний',
    dataIndex: 'adsCount',
    fixed: true,
  },
];

interface Props {
  clients: Client[];
  loading: boolean;
}

export const ClientAdsTable: FC<Props> = ({ clients, loading }) => {
  const [data, setData] = useState<DataType[]>([]);
  const [date, setDate] = useState<{ start: DateTime; end: DateTime }>();
  const [tableHeight, setTableHeight] = useState(600);
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);
  const [errors, setErrors] = useState<Ads[]>([]);
  // ref is the Table ref.
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const resize = () => {
      setWindowHeight(window.innerHeight);
    };
    window.addEventListener('resize', resize);

    return () => {
      window.removeEventListener('resize', resize);
    };
  }, []);

  useEffect(() => {
    const node = ref.current;
    if (node === null) {
      setTableHeight(windowHeight - 130);
      return;
    }
    const { top } = node.getBoundingClientRect();
    setTableHeight(windowHeight - top - 130);
  }, [ref, windowHeight]);

  useEffect(() => {
    setData(reformatClients(clients));

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
  }, [clients]);

  useEffect(() => {
    if (!date) return;

    changeDataByRange(date?.start, date?.end);
  }, [date, clients]);

  const reformatClients = (clients: Client[]) => {
    return clients.map((client) => {
      const adsCount = client.ads?.length || 0;
      return {
        key: client.id,
        name: client.name,
        adsCount,
      };
    });
  };

  const handleSearch = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const search = e.currentTarget.value;

      if (!search) return setData(reformatClients(clients));

      setData(
        reformatClients(
          clients.filter((client) => {
            return client.name.toLowerCase().match(search);
          }),
        ),
      );
    },
    [clients],
  );

  const changeDataByRange = useCallback(
    (start: DateTime, end: DateTime) => {
      const startDay = start.startOf('day');
      const endDay = end.endOf('day');

      setData(
        reformatClients(
          clients.map((client) => {
            if (!client.ads) return client;
            const newClient = { ...client };
            newClient.ads = client.ads.filter((ads) => {
              const published_at = DateTime.fromSQL(ads.published_at);
              return published_at >= startDay && published_at <= endDay;
            });
            return newClient;
          }),
        ),
      );
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

  return (
    <div className={css.container}>
      <div className={css.container__header}>
        <SenlerHeader
          filterChange={handleSearch}
          onWeekChange={handleWeekChange}
          onRangeChange={handleRangeDateChange}
        />
        <ErrorsModal errors={errors} />
      </div>
      <Table
        ref={ref}
        loading={loading}
        columns={columns}
        dataSource={data}
        pagination={false}
        scroll={{ y: tableHeight }}
        summary={() => (
          <Table.Summary fixed>
            <Table.Summary.Row>
              <Table.Summary.Cell index={0}>
                <b>Всего</b>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={1}>
                <b>{data.reduce<number>((prev, current) => prev + current.adsCount, 0)}</b>
              </Table.Summary.Cell>
            </Table.Summary.Row>
          </Table.Summary>
        )}
      />
    </div>
  );
};
