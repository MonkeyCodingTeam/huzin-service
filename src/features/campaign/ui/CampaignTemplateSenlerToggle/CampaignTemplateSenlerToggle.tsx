import { Checkbox } from 'antd';
import { CheckboxChangeEvent } from 'antd/es/checkbox';
import { FC, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { CampaignTemplate } from '@entities/campaign';
import { useToggleSenlerMutation } from '@features/campaign';
import css from './CampaignTemplateSenlerToggle.module.scss';

interface Props {
  campaignId: CampaignTemplate['id'];
  isChecked: CampaignTemplate['has_senler'];
}

export const CampaignTemplateSenlerToggle: FC<Props> = ({ campaignId, isChecked }) => {
  const [toggleSenler] = useToggleSenlerMutation();
  const [checked, setChecked] = useState(false);
  const dispatch = useDispatch();

  const onChange = (e: CheckboxChangeEvent) => {
    setChecked(e.target.checked);
    toggleSenler(campaignId)
      .unwrap()
      .then((res) => {
        setChecked(res.has_senler);
      })
      .catch(() => {
        console.log('Произошла ошибка');
      });
  };

  useEffect(() => {
    setChecked(isChecked);
  }, [isChecked]);

  return (
    <label className={css.senlerCheckBox}>
      Senler
      <Checkbox onChange={onChange} checked={checked} />
    </label>
  );
};