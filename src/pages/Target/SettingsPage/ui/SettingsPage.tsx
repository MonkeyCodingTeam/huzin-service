import { ROUTES } from '@app/providers/RouterProvider';
import { SettingsTab } from '@widgets/SettingsTab';

const SettingsPage = () => {
  const tabs = [
    {
      path: ROUTES.TARGET.SettingsClient,
      name: 'Группы',
    },
    {
      path: ROUTES.TARGET.SettingsCompanies,
      name: 'Теги',
    },
  ];

  return <SettingsTab tabs={tabs} />;
};

export default SettingsPage;
