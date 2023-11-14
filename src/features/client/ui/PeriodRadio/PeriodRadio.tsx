import { Radio, RadioChangeEvent } from 'antd';
import { FC } from 'react';
import { ClientStatsReq } from '@entities/client';

interface Props {
  onPeriodChange: (value: ClientStatsReq['period']) => void;
  period: ClientStatsReq['period'];
}

export const PeriodRadio: FC<Props> = ({ onPeriodChange, period }) => {
  const handleChange = (event: RadioChangeEvent) => {
    onPeriodChange(event.target.value);
  };

  return (
    <Radio.Group onChange={handleChange} defaultValue={period}>
      <Radio.Button value='week'>Неделя</Radio.Button>
      <Radio.Button value='month'>Месяц</Radio.Button>
    </Radio.Group>
  );
};
