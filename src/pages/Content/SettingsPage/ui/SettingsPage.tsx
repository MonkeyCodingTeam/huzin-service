import { SettingsTab } from '@widgets/SettingsTab/ui/SettingsTab';
import { ROUTES } from '@app/providers/RouterProvider';

const SettingsPage = () => {
  const tabs = [
    {
      path: ROUTES.CONTENT.GroupSettings,
      name: 'Группы',
    },
    {
      path: ROUTES.CONTENT.TagsSettings,
      name: 'Теги',
    },
  ];

  return <SettingsTab tabs={tabs} />;
};

export default SettingsPage;
