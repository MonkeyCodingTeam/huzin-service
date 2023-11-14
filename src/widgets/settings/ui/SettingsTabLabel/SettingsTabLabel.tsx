import { Typography } from 'antd';
import classNames from 'classnames';
import React from 'react';
import css from './SettingsTabLabel.module.scss';

const { Text } = Typography;

interface Props {
  text: string;
  activeTab: string;
  activeKey: string;
}

export const SettingsTabLabel = ({ text, activeTab, activeKey }: Props) => {
  return (
    <Text
      className={classNames(css.label, {
        [css.label_active]: activeTab === activeKey,
      })}
    >
      {text}
    </Text>
  );
};