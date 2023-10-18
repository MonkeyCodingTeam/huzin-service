import type { TimeRangePickerProps } from 'antd';
import { DatePicker, Grid } from 'antd';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import weekday from 'dayjs/plugin/weekday';
import React, { FC } from 'react';
import { DateRange } from 'shared/ui/DateRangePicker';

const { useBreakpoint } = Grid;

const { RangePicker } = DatePicker;
dayjs.extend(weekday);

interface Props {
  onPeriodSelect: (date_from: Dayjs | null, date_to: Dayjs | null) => void;
  defaultPeriod: DateRange;
}

export const DateRangePicker: FC<Props> = ({ onPeriodSelect, defaultPeriod }) => {
  const screens = useBreakpoint();
  const { date_from, date_to } = defaultPeriod;
  const onRangeChange = (dates: null | (Dayjs | null)[]) => {
    if (dates) {
      onPeriodSelect(dates[0], dates[1]);
    }
  };

  const rangePresets: TimeRangePickerProps['presets'] = [
    { label: 'Текущая неделя', value: [dayjs().weekday(0), dayjs()] },
    { label: 'Прошлая неделя', value: [dayjs().weekday(-7), dayjs().weekday(-1)] },
    { label: 'Позапрошлая неделя', value: [dayjs().weekday(-14), dayjs().weekday(-8)] },
    { label: 'Текущий месяц', value: [dayjs().startOf('month'), dayjs()] },
    {
      label: 'Прошлый месяц',
      value: [
        dayjs().subtract(1, 'month').startOf('month'),
        dayjs().subtract(1, 'month').endOf('month'),
      ],
    },
  ];

  return (
    <RangePicker
      presets={rangePresets}
      onChange={onRangeChange}
      disabledDate={(current) => current > dayjs().endOf('day')}
      format={'DD.MM.YYYY'}
      defaultValue={[date_from, date_to]}
      allowClear={false}
      size={screens.xs ? 'small' : 'middle'}
    />
  );
};
