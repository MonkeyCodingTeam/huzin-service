import { Typography } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { ChangeEvent, useState } from 'react';
import { SearchInput } from '@shared/ui';
import { DateRange, DateRangePicker } from '@shared/ui/DateRangePicker';
import { Transition } from '@shared/ui/Transition';
import { SenlerStatsTable } from '@widgets/senler';
import css from './SenlerPage.module.scss';

const { Text } = Typography;

const defaultPeriod: DateRange = { date_from: dayjs().weekday(-7), date_to: dayjs().weekday(-1) };

const SenlerPage = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<DateRange>(defaultPeriod);
  const [keyword, setKeyword] = useState<string>('');

  const onPeriodSelect = (date_from: Dayjs | null, date_to: Dayjs | null) => {
    if (date_from && date_to) setSelectedPeriod({ date_from, date_to });
  };

  const handleValueChange = (event: ChangeEvent<HTMLInputElement>) => {
    setKeyword(event.target.value);
  };

  return (
    <Transition className={css.senlerPage}>
      <section className={css.senlerPage__filters}>
        <div className={css.senlerPage__filter}>
          <Text className={css.senlerPage__text}>Клиент:</Text>
          <SearchInput handleValueChange={handleValueChange} />
        </div>
        <div className={css.senlerPage__filter}>
          <Text className={css.senlerPage__text}>Период:</Text>
          <DateRangePicker onPeriodSelect={onPeriodSelect} defaultPeriod={defaultPeriod} />
        </div>
      </section>
      <section className={css.senlerPage__table}>
        <SenlerStatsTable clientSearch={keyword} selectedPeriod={selectedPeriod} />
      </section>
    </Transition>
  );
};

export default SenlerPage;
