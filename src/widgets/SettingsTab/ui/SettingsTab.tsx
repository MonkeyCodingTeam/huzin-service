import { FC, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { TabPanel, TabView, TabViewTabChangeEvent } from 'primereact/tabview';
import css from './SettingsTab.module.scss';
import { Transition } from '@widgets';
import { Outlet } from 'react-router-dom';

interface SettingsTabProps {
  tabs: Tab[];
}

interface Tab {
  name: string;
  path: string;
}

export const SettingsTab: FC<SettingsTabProps> = ({ tabs }) => {
  const [activeTab, setActiveTab] = useState(0);
  const navigate = useNavigate();
  const handleTabChange = (e: TabViewTabChangeEvent) => {
    setActiveTab(e.index);
  };

  useEffect(() => {
    navigate(tabs[activeTab].path);
  }, [activeTab]);

  return (
    <Transition className={css.container}>
      <div className={css.container__block}>
        <TabView
          activeIndex={activeTab}
          panelContainerClassName={css.container__block__nav}
          onTabChange={handleTabChange}
        >
          {tabs.map((tab, index) => (
            <TabPanel key={`tab_panel_${index}`} header={tab.name} />
          ))}
        </TabView>
        <Outlet />
      </div>
    </Transition>
  );
};
