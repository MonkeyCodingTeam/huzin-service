import { FC, useEffect, useState } from 'react';
import { MonitoringTypeAPI } from '../../api/monitoring_type';
import { MonitoringType } from '../../model/monitoring_type';
import { Radio, RadioChangeEvent } from 'antd';
import { useAppDispatch, useAppSelector } from '@shared/lib/redux';
import { selectClient } from '@entities/client';

export const MonitoringTypeSelect: FC = () => {
  const [monitoringTypes, setMonitoringTypes] = useState<MonitoringType[]>([]);
  const selectedClient = useAppSelector((state: RootState) => state.selectedClient);
  const dispatch = useAppDispatch();

  useEffect(() => {
    MonitoringTypeAPI.get().then(({ data }) => setMonitoringTypes(data));
  }, []);

  const handleChange = (event: RadioChangeEvent) => {
    MonitoringTypeAPI.set(selectedClient.id, event.target.value).then(({ data }) =>
      dispatch(selectClient(data)),
    );
  };

  return (
    <Radio.Group
      onChange={handleChange}
      value={selectedClient.monitoring_type_id}
      buttonStyle='solid'
    >
      {monitoringTypes.map((type) => (
        <Radio.Button key={type.id} value={type.id}>
          {type.name}
        </Radio.Button>
      ))}
    </Radio.Group>
  );
};
