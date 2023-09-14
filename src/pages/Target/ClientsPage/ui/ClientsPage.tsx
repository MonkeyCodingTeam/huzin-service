import { Grid, Layout, Typography } from 'antd';
import { useState } from 'react';
import { CampaignTemplateSelect } from '@widgets/client/ui/CampaignTemplateSelect/CampaignTemplateSelect';
import { ClientSelect, ClientStatsTable } from 'widgets/client';
import css from './ClientsPage.module.scss';

const { Text } = Typography;
const { useBreakpoint } = Grid;

const ClientsPage = () => {
  const screens = useBreakpoint();
  const [selectedTemplate, setSelectedTemplate] = useState<number | null>();

  const onTemplateSelect = (value: number | null | undefined) => {
    setSelectedTemplate(value);
  };

  return (
    <Layout className={css.clientPage}>
      <section className={css.clientPage__filters}>
        <div className={css.clientPage__filter}>
          <Text className={css.clientPage__text} hidden={!screens.lg && !screens.xs}>
            Клиент:
          </Text>
          <ClientSelect />
        </div>
        <div className={css.clientPage__filter}>
          <Text className={css.clientPage__text} hidden={!screens.lg && !screens.xs}>
            РК:
          </Text>
          <CampaignTemplateSelect onSelect={onTemplateSelect} />
        </div>
      </section>
      <section className={css.clientPage__table}>
        <ClientStatsTable selectedTemplate={selectedTemplate} />
      </section>
    </Layout>
  );
};

export default ClientsPage;
