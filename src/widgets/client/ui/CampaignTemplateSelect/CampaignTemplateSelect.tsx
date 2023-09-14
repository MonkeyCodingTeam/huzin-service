import { Select } from 'antd';
import { FC, useState } from 'react';
import { useGetCampaignTemplatesQuery } from '@entities/campaignTemplate';
import { setArrayToOptionsFormat } from '@shared/lib/setArrayToOptionsFormat';
import css from './CampaignTemplateSelect.module.scss';

interface Props {
  onSelect: (value: number | null | undefined) => void;
}

export const CampaignTemplateSelect: FC<Props> = ({ onSelect }) => {
  const { isLoading, data = [], isFetching } = useGetCampaignTemplatesQuery(null);
  const [selectedValue, setSelectedValue] = useState<number | null>();

  const handleValueChange = (value: number | null | undefined) => {
    setSelectedValue(value);
    onSelect(value);
  };

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
