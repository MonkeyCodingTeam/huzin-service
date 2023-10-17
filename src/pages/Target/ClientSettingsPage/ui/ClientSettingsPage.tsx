import { Col, Row, Typography } from 'antd';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { ClientInfo } from '@entities/client';
import { TelegramBotInfo } from '@entities/telegram';
import { ClientSelect } from '@features/client/stats';
import { TARGET_ROUTES } from '@shared/const';
import { Transition } from '@shared/ui/Transition';
import { SettingsTabs } from '@widgets/settings';
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

  return (
    <Transition className={css.clientSettingsPage}>
      <section className={css.clientSettingsPage__filters}>
        <div className={css.clientSettingsPage__filter}>
          <Text className={css.clientSettingsPage__text}>Клиент:</Text>
          <ClientSelect />
        </div>
      </section>
      <section>
        <Row gutter={16}>
          <Col span={16}>
            <div className={css.clientSettingsPage__content}>
              <SettingsTabs />
            </div>
          </Col>
          <Col span={8}>
            <div className={css.clientSettingsPage__content}>
              <ClientInfo>
                <TelegramBotInfo />
              </ClientInfo>
            </div>
          </Col>
        </Row>
      </section>
    </Transition>
  );
};

export default ClientSettingsPage;
