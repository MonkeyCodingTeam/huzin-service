import { FC } from 'react';
import { GuestStatsTable } from '@entities/client';
import { GuestStatsTablesTitle } from '@widgets/guestStats';
import { TableData_campaign } from '../../types/types';
import css from './GuestStatsCampaignsTablesWrapper.module.scss';

interface Props {
  tableData: TableData_campaign[];
  isLoading: boolean;
}

export const GuestStatsCampaignsTablesWrapper: FC<Props> = ({ tableData, isLoading }) => {
  if (!tableData.length) return <></>;
  return (
    <div id={'campaigns'} className={css.table}>
      <GuestStatsTablesTitle title={'Рекламные компании'} />
      {tableData.map((item) => (
        <GuestStatsTable
          dataTable={item.tableData}
          dividerText={item.tableTitle}
          isLoading={isLoading}
          key={item.id}
        />
      ))}
    </div>
  );
};
