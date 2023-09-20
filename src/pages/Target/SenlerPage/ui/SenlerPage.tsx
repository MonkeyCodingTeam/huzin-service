import { Typography } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { useState } from 'react';
import { Transition } from '@shared/ui/Transition';
import { Period } from '@widgets/senler';
import { SenlerClientsFilter } from '@widgets/senler/ui/SenlerClientsFilter/SenlerClientsFilter';
import { SenlerRangePicker } from '@widgets/senler/ui/SenlerRangePicker/SenlerRangePicker';
import { SenlerStatsTable } from '@widgets/senler/ui/SenlerStatsTable/SenlerStatsTable';
import css from './SenlerPage.module.scss';

const { Text } = Typography;
const defaultPeriod: Period = { date_from: dayjs().weekday(-7), date_to: dayjs().weekday(-1) };

const SenlerPage = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<Period>(defaultPeriod);
  const [keyword, setKeyword] = useState<string>('');
  const onPeriodSelect = (date_from: Dayjs | null, date_to: Dayjs | null) => {
    if (date_from && date_to) setSelectedPeriod({ date_from, date_to });
  };

  return (
    <Transition className={css.senlerPage}>
      <section className={css.senlerPage__filters}>
        <div className={css.senlerPage__filter}>
          <Text className={css.senlerPage__text}>Клиент:</Text>
          <SenlerClientsFilter handleValueChange={(value) => setKeyword(value)} />
        </div>
        <div className={css.senlerPage__filter}>
          <Text className={css.senlerPage__text}>Период:</Text>
          <SenlerRangePicker onPeriodSelect={onPeriodSelect} defaultPeriod={defaultPeriod} />
        </div>
      </section>
      <section className={css.senlerPage__table}>
        <SenlerStatsTable clientSearch={keyword} selectedPeriod={selectedPeriod} />
      </section>
    </Transition>
  );
};

export default SenlerPage;
