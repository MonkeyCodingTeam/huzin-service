import { Typography } from 'antd';
import classNames from 'classnames';
import React from 'react';
import css from './SettingsTab.module.scss';

const { Text } = Typography;

interface Props {
  text: string;
  activeTab: string;
  activeKey: string;
}

export const SettingsTab = ({ text, activeTab, activeKey }: Props) => {
  return (
    <Text
      className={classNames(css.tab, {
        [css.tab_active]: activeTab === activeKey,
      })}
    >
      {text}
    </Text>
  );
};
