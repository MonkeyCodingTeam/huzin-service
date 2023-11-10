import { FC } from 'react';
import { GuestStatsTable, StatsRes } from '@entities/client';
import { GuestStatsTablesTitle } from '@widgets/guestStats';
import css from './GuestStatsTableWrapper.module.scss';

interface Props {
  tableData: StatsRes[];
  isLoading: boolean;
  isOther?: boolean;
}

export const GuestStatsTableWrapper: FC<Props> = ({ tableData, isLoading, isOther }) => {
  if (!tableData.length) return <></>;
  return (
    <div className={css.table}>
      <GuestStatsTablesTitle
        title={isOther ? 'Другие компании' : 'Общая статистика'}
        marginBottom={'1rem'}
      />
      <GuestStatsTable dataTable={tableData} isLoading={isLoading} />
    </div>
  );
};
