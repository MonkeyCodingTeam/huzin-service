import { DataTable } from 'primereact/datatable';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { CompanyTemplateAPI } from '@shared/lib/api';
import { DateTime } from 'luxon';
import { Column } from 'primereact/column';
import css from './ClientTable.module.scss';
import { SelectButton } from 'primereact/selectbutton';
import { TableLoader } from '@widgets';
import { groupStatsByPeriod } from '@shared/lib/util/groupStatsByPeriod';
import { PeriodStatistic } from '@entities/client/types';
import { CompanyTemplate } from '@shared/lib/api/target/types';
import { ClientAPI } from '@entities/client';

export const ClientTable = () => {
  const selectedClient = useSelector((state: RootState) => state.selectedClient);
  const [selectedTemplate, setSelectedTemplate] = useState<CompanyTemplate>();
  const [companyTemplate, setCompanyTemplate] = useState<CompanyTemplate[]>([]);
  const [stats, setStats] = useState<PeriodStatistic[]>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    CompanyTemplateAPI.getAll().then((res) => {
      setCompanyTemplate(res.data);
    });
  }, []);

  useEffect(() => {
    setLoading(true);
    if (selectedClient.id) {
      ClientAPI.getStatistics(selectedClient.id, {
        date_from: DateTime.now().minus({ month: 3 }),
        date_to: DateTime.now(),
        metrics: ['base', 'uniques'],
        company_template_id: selectedTemplate?.id,
      }).then((res) => {
        setStats(groupStatsByPeriod(res.data, 'week'));
        console.log(res.data);
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, [selectedClient.id, selectedTemplate?.id]);

  const dateBodyTemplate = (stat: PeriodStatistic) => {
    const date = DateTime.fromFormat(stat.date, 'yyyy-MM-dd').toFormat('dd.MM');
    return <span>{date}</span>;
  };

  const truncateTemplate = (stat?: number) => (
    <span>{stat ? Math.round(stat).toLocaleString() : '-'}</span>
  );

  const toLocaleStringTemplate = (stat?: number, precision = 1) => (
    <span>{stat ? (+stat).toFixed(precision).toLocaleString() : '-'}</span>
  );

  return (
    <div className={css.box}>
      <div className={css.box__container}>
        <SelectButton
          value={selectedTemplate}
          options={companyTemplate}
          onChange={(e) => setSelectedTemplate(e.value)}
          optionLabel='name'
        />
        <TableLoader isLoading={loading}>
          <DataTable
            selectionMode='single'
            value={stats}
            sortField='date'
            sortOrder={-1}
            reorderableColumns
            tableStyle={{
              borderCollapse: 'separate',
              alignItems: 'center',
            }}
            className={css.box__container__table}
            showGridlines
            scrollable
            scrollHeight='calc(100vh - 120px)'
            key='id'
            globalFilterFields={['name']}
            emptyMessage='Нет данных'
          >
            <Column header='Дата' field='date' sortable body={dateBodyTemplate} />
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
              body={(stat) =>
                stat.shows ? toLocaleStringTemplate((stat.clicks / stat.shows) * 100, 2) : '-'
              }
            />
            <Column
              header='CPC'
              field='cpc'
              headerTooltip='Эффективная цена за клик'
              headerTooltipOptions={{
                position: 'bottom',
              }}
              body={(stat) =>
                stat.clicks ? toLocaleStringTemplate(stat.spent / stat.clicks) : '-'
              }
            />
            <Column
              header='CPM'
              field='cpm'
              headerTooltip='Эффективная цена за тысячу показов'
              headerTooltipOptions={{
                position: 'bottom',
              }}
              body={(stat) => toLocaleStringTemplate(stat.spent / stat.shows, 2)}
            />
          </DataTable>
        </TableLoader>
      </div>
    </div>
  );
};
