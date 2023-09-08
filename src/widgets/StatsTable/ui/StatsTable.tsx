import { DateTime } from 'luxon';
import { IStatReq } from '@entities/client';
import { useGetClientStatsQuery } from '@entities/client';

const semiAnnualReport: IStatReq = {
  id: 0,
  period: 'week',
  date_from: DateTime.now().minus({ month: 5 }).toISODate(),
  date_to: DateTime.now().toISODate(),
};

interface Props {
  clientId: number;
}

export const StatsTable = ({ clientId }: Props) => {
  // const [stats, setStats] = useState<IStatResp[]>();
  const { isLoading, isError, data } = useGetClientStatsQuery({
    ...semiAnnualReport,
    id: clientId,
  });
  if (isLoading) {
    console.log('Data is loading');
  } else {
    if (data) {
      // const sum = sumStatsForPeriod([...data], 'week');
      // if (sum) setStats(sum);
      console.log(data);
    }
  }
  if (isError) console.log('error occurred');
  return <div>check console!</div>;
};
