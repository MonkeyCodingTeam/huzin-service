import { DataTable } from 'primereact/datatable';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { ClientAPI } from '@shared/lib/api';
import { DateTime } from 'luxon';
import { BaseStatistic, StatisticResponse, UniquesStatistic } from '@shared/lib/api/target/types';
import { Column } from 'primereact/column';
import { TableSkeleton } from '@shared/ui/Skeletons';
import { ClientTableHeader } from '@pages/Target/ClientsPage/ui/ClientTable/ui/ClientTableHeader';
import _ from 'lodash';

interface StatFields extends Partial<BaseStatistic>, Partial<UniquesStatistic> {
  week: string;
}

export const ClientTable = () => {
  const selectedClient = useSelector((state: RootState) => state.selectedClient);
  const [stats, setStats] = useState<StatFields[]>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    if (selectedClient.id) {
      ClientAPI.getStatistics(selectedClient.id, {
        date_from: DateTime.now().minus({ month: 3 }),
        date_to: DateTime.now(),
        metrics: ['base', 'uniques'],
      }).then((res) => {
        const stats: Record<string, StatisticResponse[]> = _.groupBy(
          res.data.items[0].rows,
          (item) => {
            return DateTime.fromFormat(item.date, 'y-MM-dd').startOf('week').toFormat('yMMdd');
          },
        );
        setStats(() =>
          _.reduce(
            stats,
            (result: StatFields[], value, key) => {
              const spent = _.sumBy(value, (o) => +(o.base?.spent || 0));
              const clicks = _.sumBy(value, (o) => +(o.base?.clicks || 0));
              const shows = _.sumBy(value, (o) => +(o.base?.shows || 0));
              result.push({
                week: key,
                spent,
                clicks,
                shows,
                ctr: shows && (clicks / shows) * 100,
                cpc: spent / clicks,
                cpm: spent / shows,
              });
              return result;
            },
            [],
          ),
        );
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, [selectedClient.id]);

  const dateBodyTemplate = (stat: StatFields) => {
    const date = DateTime.fromFormat(stat.week, 'yMMdd').toFormat('dd.MM');
    return <span>{date}</span>;
  };

  const truncateTemplate = (stat?: number) => (
    <span>{stat ? Math.trunc(stat).toLocaleString() : '-'}</span>
  );

  const toLocaleStringTemplate = (stat?: number, precision = 1) => (
    <span>{stat ? (+stat).toFixed(precision).toLocaleString() : '-'}</span>
  );

  return loading ? (
    <TableSkeleton rows={10} columns={6} style={{ width: '100%' }} />
  ) : (
    <DataTable
      selectionMode='single'
      value={stats}
      sortField='week'
      sortOrder={-1}
      scrollable
      scrollHeight='calc(100vh - 90px)'
      reorderableColumns
      tableStyle={{
        borderCollapse: 'separate',
        alignItems: 'center',
      }}
      style={{ width: '100%' }}
      showGridlines
      rows={10}
      key='id'
      globalFilterFields={['name']}
      header={ClientTableHeader}
      emptyMessage='Нет данных'
    >
      <Column header='Дата' field='week' sortable body={dateBodyTemplate} />
      <Column
        header='Расход'
        field='spent'
        sortable
        body={(stat) => truncateTemplate(stat.spent)}
      />
      <Column
        header='Клики'
        field='clicks'
        sortable
        body={(stat) => truncateTemplate(stat.clicks)}
      />
      <Column
        header='Показы'
        field='shows'
        sortable
        body={(stat) => truncateTemplate(stat.shows)}
      />
      <Column
        header='CTR'
        field='ctr'
        headerTooltip='Коэффициент кликабельности'
        headerTooltipOptions={{
          position: 'bottom',
        }}
        body={(stat) => toLocaleStringTemplate(stat.ctr, 2)}
      />
      <Column
        header='CPC'
        field='cpc'
        headerTooltip='Эффективная цена за клик'
        headerTooltipOptions={{
          position: 'bottom',
        }}
        body={(stat) => toLocaleStringTemplate(stat.cpc)}
      />
      <Column
        header='CPM'
        field='cpm'
        headerTooltip='Эффективная цена за тысячу показов'
        headerTooltipOptions={{
          position: 'bottom',
        }}
        body={(stat) => toLocaleStringTemplate(stat.cpm, 2)}
      />
    </DataTable>
  );
};
