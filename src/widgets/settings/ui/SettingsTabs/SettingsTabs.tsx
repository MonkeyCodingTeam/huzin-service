import { Tabs } from 'antd';
import React from 'react';
import { GeneralSettingsForm } from '@features/client/settings';
import css from './SettingsTabs.module.scss';

export const SettingsTabs = () => {
  return (
    <Tabs
      defaultActiveKey='1'
      items={[
        {
          label: 'Настройки клиента',
          key: '1',
          children: (
            <div className={css.tabs__element}>
              <GeneralSettingsForm />
            </div>
          ),
        },
        {
          label: 'Настройки группы',
          key: '2',
          children: 'Tab 2',
          disabled: true,
        },
      ]}
    />
  );
};
