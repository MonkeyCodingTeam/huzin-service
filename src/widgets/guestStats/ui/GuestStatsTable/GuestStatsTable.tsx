import { FC } from 'react';
import { GuestStatsTable as StatsTable, StatsRes } from '@entities/client';
import { GuestStatsTablesTitle } from '@widgets/guestStats';
import { TableData_campaign } from '../../types/types';
import css from './GuestStatsTable.module.scss';

interface Props {
  tableData?: StatsRes[];
  tableDataCampaigns?: TableData_campaign[];
  title: string;
  titleMarginBottom?: string;
}

export const GuestStatsTable: FC<Props> = ({
  tableData = [],
  tableDataCampaigns = [],
  title,
  titleMarginBottom = '1rem',
}) => {
  if (!tableData.length && !tableDataCampaigns.length) return <></>;
  return (
    <div className={css.table}>
      <GuestStatsTablesTitle title={title} marginBottom={titleMarginBottom} />
      {tableDataCampaigns.length ? (
        tableDataCampaigns.map((item) => (
          <StatsTable dataTable={item.tableData} dividerText={item.tableTitle} key={item.id} />
        ))
      ) : (
        <StatsTable dataTable={tableData} />
      )}
    </div>
  );
};
