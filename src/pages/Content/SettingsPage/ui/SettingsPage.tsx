import { SettingsTab } from '@widgets/SettingsTab/ui/SettingsTab';
import { ROUTES } from '@app/providers/RouterProvider';

const SettingsPage = () => {
  return (
    <SettingsTab
      tabs={[
        {
          path: ROUTES.CONTENT.GroupSettings,
          name: 'Группы',
        },
        {
          path: ROUTES.CONTENT.TagsSettings,
          name: 'Теги',
        },
      ]}
    />
  );
};

export default SettingsPage;
