import { DatePicker, DatePickerProps } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { FC, useEffect, useState } from 'react';

interface Props {
  onWeekSelect: (week: Dayjs) => void;
}

export const SenlerDatePicker: FC<Props> = ({ onWeekSelect }) => {
  const [pickedDate, setPickedDate] = useState<Dayjs>();

  const onChange: DatePickerProps['onChange'] = (date) => {
    if (date) {
      setPickedDate(date.startOf('week'));
    }
  };

  const disabledDate = (current: Dayjs) => {
    return current > dayjs().endOf('day') || current < dayjs().subtract(3, 'month');
  };

  useEffect(() => {
    if (pickedDate) onWeekSelect(pickedDate);
  }, [pickedDate]);

  return (
    <DatePicker
      onChange={onChange}
      picker='week'
      allowClear={false}
      defaultValue={dayjs().startOf('week')}
      format={'DD.MM.YYYY'}
      value={pickedDate}
      disabledDate={disabledDate}
    />
  );
};
