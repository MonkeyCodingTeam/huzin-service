import { SettingsTab } from '@widgets/SettingsTab/ui/SettingsTab';

const SettingsPage = () => {
  return (
    <SettingsTab
      tabs={[
        {
          path: '',
          name: 'Группы',
        },
        {
          path: '',
          name: 'Теги',
        },
      ]}
    />
  );
};

export default SettingsPage;
