import { Transition } from '@widgets';
import css from './SettingsPage.module.scss';
import { Outlet, useNavigate } from 'react-router';
import { TabPanel, TabView, TabViewTabChangeEvent } from 'primereact/tabview';
import { ROUTES } from '@shared/const/routes';
import { useEffect, useState } from 'react';

const TabRoutes = [ROUTES.TARGET.SettingsClient, ROUTES.TARGET.SettingsCompanies];

export const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState(0);
  const navigate = useNavigate();
  const handleTabChange = (e: TabViewTabChangeEvent) => {
    setActiveTab(e.index);
  };

  useEffect(() => {
    navigate(TabRoutes[activeTab]);
  }, [activeTab]);

  return (
    <Transition className={css.container}>
      <div className={css.container__block}>
        <TabView
          activeIndex={activeTab}
          panelContainerClassName={css.container__block__nav}
          onTabChange={handleTabChange}
        >
          <TabPanel header='Проекты' />
          <TabPanel header='Компании' />
        </TabView>
        <Outlet />
      </div>
    </Transition>
  );
};
