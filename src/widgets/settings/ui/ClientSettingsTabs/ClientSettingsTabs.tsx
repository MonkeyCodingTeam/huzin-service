import { Tabs } from 'antd';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { ClientSettingsForm } from '@features/client';
import { StatusBadge } from 'shared/ui/StatusBadge';
import { ClientSettingsTab, ClientSettingsTabLabel } from 'widgets/settings';
import css from './ClientSettingsTabs.module.scss';

export const ClientSettingsTabs = () => {
  const [activeTab, setActiveTab] = useState<string>('1');
  const client = useSelector((state: RootState) => state.selectedClient);

  const onChangeTab = (activeKey: string) => {
    setActiveTab(activeKey);
    localStorage.setItem('selected-tab', `${activeKey}`);
  };

  useEffect(() => {
    const localTab = localStorage.getItem('selected-tab');
    if (localTab) setActiveTab(localTab);
  }, []);

  return (
    <Tabs
      className={css.tabs}
      onChange={onChangeTab}
      activeKey={activeTab}
      items={[
        {
          label: (
            <StatusBadge isError={false}>
              <ClientSettingsTabLabel
                text={'Настройки клиента'}
                activeTab={activeTab}
                activeKey={'1'}
              />
            </StatusBadge>
          ),
          key: '1',
          children: (
            <div className={css.tabs__element}>
              <ClientSettingsForm />
            </div>
          ),
        },

        {
          label: (
            <StatusBadge isError={!client.group_id}>
              <ClientSettingsTabLabel
                text={'Настройки группы'}
                activeTab={activeTab}
                activeKey={'2'}
              />
            </StatusBadge>
          ),
          key: '2',
          children: (
            <div className={css.tabs__element}>
              <ClientSettingsTab />
            </div>
          ),
        },
      ]}
    />
  );
};
