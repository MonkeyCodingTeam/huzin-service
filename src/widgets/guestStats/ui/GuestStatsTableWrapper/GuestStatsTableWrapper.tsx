import { FC } from 'react';
import { GuestStatsTable, StatsRes } from '@entities/client';
import { GuestStatsTablesTitle } from '@widgets/guestStats';
import { TableData_campaign } from '../../types/types';
import css from './GuestStatsTableWrapper.module.scss';

interface Props {
  tableData?: StatsRes[];
  tableDataCampaigns?: TableData_campaign[];
  isLoading: boolean;
  title: string;
  titleMarginBottom?: string;
}

export const GuestStatsTableWrapper: FC<Props> = ({
  tableData = [],
  tableDataCampaigns = [],
  isLoading,
  title,
  titleMarginBottom = '1rem',
}) => {
  if (!tableData.length && !tableDataCampaigns.length) return <></>;
  return (
    <div className={css.table}>
      <GuestStatsTablesTitle title={title} marginBottom={titleMarginBottom} />
      {tableDataCampaigns.length ? (
        tableDataCampaigns.map((item) => (
          <GuestStatsTable
            dataTable={item.tableData}
            dividerText={item.tableTitle}
            isLoading={isLoading}
            key={item.id}
          />
        ))
      ) : (
        <GuestStatsTable dataTable={tableData} isLoading={isLoading} />
      )}
    </div>
  );
};
