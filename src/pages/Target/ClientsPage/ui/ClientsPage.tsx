import { Typography } from 'antd';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { TARGET_ROUTES } from '@shared/const';
import { Transition } from '@shared/ui/Transition';
import { CampaignTemplateSelect } from '@widgets/client/ui/CampaignTemplateSelect/CampaignTemplateSelect';
import { ClientSelect, ClientStatsTable } from 'widgets/client';
import css from './ClientsPage.module.scss';

const { Text } = Typography;

const ClientsPage = () => {
  const navigate = useNavigate();

  const [selectedTemplate, setSelectedTemplate] = useState<number | null>();
  const selectedClientId = useSelector((state: RootState) => state.selectedClient.id);

  const onTemplateSelect = (value: number | null | undefined) => {
    setSelectedTemplate(value);
  };

  useEffect(() => {
    if (selectedClientId) {
      navigate(`${TARGET_ROUTES.BaseClientStats}/${selectedClientId}`);
    }
  }, [selectedClientId]);

  return (
    <Transition className={css.clientPage}>
      <section className={css.clientPage__filters}>
        <div className={css.clientPage__filter}>
          <Text className={css.clientPage__text}>Клиент:</Text>
          <ClientSelect />
        </div>
        <div className={css.clientPage__filter}>
          <Text className={css.clientPage__text}>РК:</Text>
          <CampaignTemplateSelect onSelect={onTemplateSelect} />
        </div>
      </section>
      <section className={css.clientPage__table}>
        <ClientStatsTable selectedTemplate={selectedTemplate} />
      </section>
    </Transition>
  );
};

export default ClientsPage;
