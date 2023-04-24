import { DataTable } from 'primereact/datatable';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { ClientAPI } from '@shared/lib/api';
import { DateTime } from 'luxon';
import { StatisticResponse } from '@shared/lib/api/target/types';
import { Column } from 'primereact/column';
import { TableSkeleton } from '@shared/ui/Skeletons';
import { ClientTableHeader } from '@pages/Target/ClientsPage/ui/ClientTable/ui/ClientTableHeader';
import css from './ClientTable.module.scss';

export const ClientTable = () => {
  const selectedClient = useSelector((state: RootState) => state.selectedClient);
  const [stats, setStats] = useState<StatisticResponse[]>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    if (selectedClient.id) {
      ClientAPI.getStatistics(selectedClient.id, {
        period: 'week',
        date_from: DateTime.now().minus({ month: 5 }),
        date_to: DateTime.now(),
      }).then((res) => {
        setStats(res.data);
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, [selectedClient.id]);

  const dateBodyTemplate = (stat: StatisticResponse) => {
    const date = DateTime.fromFormat(stat.day_from, 'yMMdd').toFormat('dd.MM.yyyy');
    return <span>{date}</span>;
  };

  const spentBodyTemplate = (stat: StatisticResponse) => (
    <span>{stat.spent ? Math.trunc(stat.spent).toLocaleString() : '-'}</span>
  );
  const clicksBodyTemplate = (stat: StatisticResponse) => (
    <span>{stat.clicks ? Math.trunc(stat.clicks).toLocaleString() : '-'}</span>
  );
  const impressionsBodyTemplate = (stat: StatisticResponse) => (
    <span>{stat.impressions ? Math.trunc(stat.impressions).toLocaleString() : '-'}</span>
  );
  const cpcBodyTemplate = (stat: StatisticResponse) => (
    <span>
      {stat.effective_cost_per_click
        ? (+stat.effective_cost_per_click).toFixed(1).toLocaleString()
        : '-'}
    </span>
  );
  const cpmBodyTemplate = (stat: StatisticResponse) => (
    <span>
      {stat.effective_cost_per_mille
        ? (+stat.effective_cost_per_mille).toFixed(1).toLocaleString()
        : '-'}
    </span>
  );

  return (
    <div className={css.box}>
      <div className={css.box__container}>
        <ClientTableHeader client={selectedClient} className={css.box__container__header} />
        {loading ? (
          <TableSkeleton rows={10} columns={6} style={{ width: '100%' }} />
        ) : (
          <DataTable
            selectionMode='single'
            value={stats}
            sortField='day_to'
            sortOrder={-1}
            reorderableColumns
            tableStyle={{
              borderCollapse: 'separate',
              alignItems: 'center',
            }}
            className={css.box__container__table}
            showGridlines
            rows={10}
            key='id'
            globalFilterFields={['name']}
            emptyMessage='Нет данных'
          >
            <Column header='Дата' field='day_from' sortable body={dateBodyTemplate} />
            <Column header='Расход' field='spent' sortable body={spentBodyTemplate} />
            <Column header='Клики' field='clicks' sortable body={clicksBodyTemplate} />
            <Column header='Охват' field='impressions' sortable body={impressionsBodyTemplate} />
            <Column
              header='CTR'
              field='ctr'
              headerTooltip='Коэффициент кликабельности'
              headerTooltipOptions={{
                position: 'bottom',
              }}
            />
            <Column
              header='CPC'
              field='effective_cost_per_click'
              headerTooltip='Эффективная цена за клик'
              headerTooltipOptions={{
                position: 'bottom',
              }}
              body={cpcBodyTemplate}
            />
            <Column
              header='CPM'
              field='effective_cost_per_mille'
              headerTooltip='Эффективная цена за тысячу показов'
              headerTooltipOptions={{
                position: 'bottom',
              }}
              body={cpmBodyTemplate}
            />
          </DataTable>
        )}
      </div>
    </div>
  );
};
