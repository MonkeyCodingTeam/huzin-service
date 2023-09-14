import { Divider, Typography } from 'antd';
import { Transition } from '@shared/ui/Transition';
import { CampaignTemplateSelect } from '@widgets/client/ui/CampaignTemplateSelect/CampaignTemplateSelect';
import { ClientSelect, ClientStatsTable } from 'widgets/client';
import css from './ClientsPage.module.scss';

const { Text } = Typography;

const ClientsPage = () => {
  return (
    <Transition className={css.clientPage__container}>
      <section className={css.clientPage__filters}>
        <Text>Клиент: </Text>
        <ClientSelect />
        <Divider type='vertical' />
        <Text>Шаблон: </Text>
        <CampaignTemplateSelect />
      </section>
      <div className={css.clientPage__table}>
        <ClientStatsTable />
      </div>
    </Transition>
  );
};

export default ClientsPage;
