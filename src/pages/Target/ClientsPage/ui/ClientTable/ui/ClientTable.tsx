import { DataTable } from 'primereact/datatable';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { DateTime } from 'luxon';
import { Column } from 'primereact/column';
import css from './ClientTable.module.scss';
import { SelectButton } from 'primereact/selectbutton';
import { sumStats } from '@shared/lib/util/sumStats';
import { TableLoader } from '@widgets';
import { ClientAPI, StatisticResponse } from '@entities/client';
import { CompanyTemplateAPI } from '@shared/lib/api';
import { CompanyTemplate } from '@shared/lib/api/target/types';

export const ClientTable = () => {
  const selectedClient = useSelector((state: RootState) => state.selectedClient);
  const [stats, setStats] = useState<StatisticResponse[]>();
  const [selectedTemplate, setSelectedTemplate] = useState<CompanyTemplate>();
  const [companyTemplate, setCompanyTemplate] = useState<CompanyTemplate[]>([]);
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
        period: 'week',
        date_from: DateTime.now().minus({ month: 5 }),
        date_to: DateTime.now(),
        company_template_id: selectedTemplate?.id,
      }).then((res) => {
        setStats(sumStats(res.data, 'day_from'));
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, [selectedClient.id, selectedTemplate?.id]);

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
        <TableLoader isLoading={loading}>
          <SelectButton
            value={selectedTemplate}
            options={companyTemplate}
            onChange={(e) => setSelectedTemplate(e.value)}
            optionLabel='name'
          />
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
            scrollable
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
        </TableLoader>
      </div>
    </div>
  );
};
