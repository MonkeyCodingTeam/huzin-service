import { SearchOutlined } from '@ant-design/icons';
import { Input, Typography } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { ChangeEvent, useState } from 'react';
import { Transition } from '@shared/ui/Transition';
import { Period } from '@widgets/senler';
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

  const handleValueChange = (event: ChangeEvent<HTMLInputElement>) => {
    setKeyword(event.target.value);
  };

  // const debouncedHandler = useCallback(debounce(handleValueChange, 300), []);
  //
  // useEffect(() => {
  //   return () => {
  //     debouncedHandler.cancel();
  //   };
  // }, [keyword]);

  return (
    <Transition className={css.senlerPage}>
      <section className={css.senlerPage__filters}>
        <div className={css.senlerPage__filter}>
          <Text className={css.senlerPage__text}>Клиент:</Text>
          <Input
            suffix={<SearchOutlined />}
            placeholder={'Поиск...'}
            onChange={handleValueChange}
          />
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
