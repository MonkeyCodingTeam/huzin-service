import { Typography } from 'antd';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { TARGET_ROUTES } from '@shared/const';
import { Transition } from '@shared/ui/Transition';
import { ClientSelect } from '@widgets/client';
import css from './ClientSettingsPage.module.scss';

const { Text } = Typography;

const ClientSettingsPage = () => {
  const navigate = useNavigate();
  const selectedClientId = useSelector((state: RootState) => state.selectedClient.id);

  useEffect(() => {
    if (selectedClientId) {
      navigate(`${TARGET_ROUTES.BaseClientSettings}/${selectedClientId}`);
    }
  }, [selectedClientId]);

  console.log(selectedClientId);

  return (
    <Transition className={css.clientSettingsPage}>
      <section className={css.clientSettingsPage__filters}>
        <div className={css.clientSettingsPage__filter}>
          <Text className={css.clientSettingsPage__text}>Клиент:</Text>
          <ClientSelect />
        </div>
      </section>
    </Transition>
  );
};

export default ClientSettingsPage;
