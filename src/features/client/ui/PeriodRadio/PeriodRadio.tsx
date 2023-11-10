import { Radio, RadioChangeEvent } from 'antd';
import { FC, useEffect, useState } from 'react';
import { ClientStatsReq } from '@entities/client';

interface Props {
  onPeriodChange: (value: ClientStatsReq['period']) => void;
}

export const PeriodRadio: FC<Props> = ({ onPeriodChange }) => {
  const [value, setValue] = useState<ClientStatsReq['period']>('week');

  const handleChange = (event: RadioChangeEvent) => {
    setValue(event.target.value);
  };

  useEffect(() => {
    if (value) onPeriodChange(value);
  }, [value]);

  return (
    <Radio.Group onChange={handleChange} defaultValue={value}>
      <Radio.Button value='week'>Неделя</Radio.Button>
      <Radio.Button value='month'>Месяц</Radio.Button>
    </Radio.Group>
  );
};
