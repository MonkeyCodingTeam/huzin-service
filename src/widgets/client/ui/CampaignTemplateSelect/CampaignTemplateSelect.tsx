import { Select } from 'antd';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  setSelectedCampaignTemplate,
  useGetCampaignTemplatesQuery,
} from '@entities/campaignTemplate';
import { setArrayToOptionsFormat } from '@shared/lib/setArrayToOptionsFormat';
import css from './CampaignTemplateSelect.module.scss';

export const CampaignTemplateSelect = () => {
  const dispatch = useDispatch();

  const { isLoading, data = [], isFetching } = useGetCampaignTemplatesQuery(null);
  const [selectedValue, setSelectedValue] = useState<number | null>();
  const handleValueChange = (value: number) => {
    setSelectedValue(value);
  };

  useEffect(() => {
    if (selectedValue) {
      dispatch(setSelectedCampaignTemplate(data.find((template) => template.id === selectedValue)));
    } else {
      dispatch(setSelectedCampaignTemplate([]));
    }
  }, [selectedValue]);

  // const ucFirst = (str: string) => str[0].toUpperCase() + str.slice(1);

  return (
    <Select
      allowClear
      onClear={() => setSelectedValue(null)}
      className={css.templatesSelect}
      loading={isLoading && isFetching}
      placeholder='Выберите РК'
      optionFilterProp='children'
      options={setArrayToOptionsFormat(data, 'id', 'name')}
      onChange={(value) => handleValueChange(value)}
      value={selectedValue}
      filterOption={(input, option): boolean => {
        if (!option) return false;
        return option.label.toLowerCase().includes(input.toLowerCase());
      }}
    />
  );
};
