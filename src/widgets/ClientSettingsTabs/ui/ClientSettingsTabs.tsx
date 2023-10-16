import { Tabs } from 'antd';
import React from 'react';
import { GeneralSettingsForm } from '@features/client/settings';
import css from './ClientSettingsTabs.module.scss';

export const ClientSettingsTabs = () => {
  return (
    <Tabs
      defaultActiveKey='1'
      items={[
        {
          label: 'Информация о клиенте',
          key: '1',
          children: (
            <section className={css.tabs__element}>
              <GeneralSettingsForm />
            </section>
          ),
        },
        {
          label: 'Информация о группе',
          key: '2',
          children: 'Tab 2',
          disabled: true,
        },
      ]}
    />
  );
};
