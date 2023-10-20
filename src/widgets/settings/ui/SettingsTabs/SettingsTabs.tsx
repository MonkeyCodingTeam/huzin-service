import { Tabs } from 'antd';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { ClientSettingsForm } from '@features/client';
import { GroupAdd } from '@features/group';
import { StatusBadge } from 'shared/ui/StatusBadge';
import { SettingsTabLabel } from 'widgets/settings/ui/SettingsTabLabel';
import css from './SettingsTabs.module.scss';

export const SettingsTabs = () => {
  const [activeTab, setActiveTab] = useState<string>('1');
  const client = useSelector((state: RootState) => state.selectedClient);

  const onChangeTab = (activeKey: string) => {
    console.log(activeKey);
    setActiveTab(activeKey);
  };

  return (
    <Tabs
      className={css.tabs}
      defaultActiveKey={'1'}
      onChange={onChangeTab}
      items={[
        {
          label: (
            <StatusBadge isError={false}>
              <SettingsTabLabel text={'Настройки клиента'} activeTab={activeTab} activeKey={'1'} />
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
              <SettingsTabLabel text={'Настройки группы'} activeTab={activeTab} activeKey={'2'} />
            </StatusBadge>
          ),
          key: '2',
          children: (
            <div className={css.tabs__element}>
              <GroupAdd />
            </div>
          ),
        },
      ]}
    />
  );
};
