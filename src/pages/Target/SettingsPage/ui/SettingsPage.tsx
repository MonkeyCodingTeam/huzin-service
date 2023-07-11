import { ROUTES } from '@app/providers/RouterProvider/const/routes';
import { SettingsTab } from '@widgets/SettingsTab/ui/SettingsTab';

const TabRoutes = [ROUTES.TARGET.SettingsClient, ROUTES.TARGET.SettingsCompanies];

const SettingsPage = () => {
  return (
    <SettingsTab
      tabs={[
        {
          name: 'Клиенты',
          path: ROUTES.TARGET.SettingsClient,
        },
        {
          name: 'Компании',
          path: ROUTES.TARGET.SettingsCompanies,
        },
      ]}
    />
  );
};

export default SettingsPage;
