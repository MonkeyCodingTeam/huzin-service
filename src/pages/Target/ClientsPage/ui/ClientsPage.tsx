import { Grid, Typography } from 'antd';
import { Transition } from '@shared/ui/Transition';
import { CampaignTemplateSelect } from '@widgets/client/ui/CampaignTemplateSelect/CampaignTemplateSelect';
import { ClientSelect, ClientStatsTable } from 'widgets/client';
import css from './ClientsPage.module.scss';

const { Text } = Typography;
const { useBreakpoint } = Grid;

const ClientsPage = () => {
  const screens = useBreakpoint();

  console.log(screens);

  return (
    <Transition className={css.clientPage__container}>
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
          <CampaignTemplateSelect />
        </div>
      </section>
      <div className={css.clientPage__table}>
        <ClientStatsTable />
      </div>
    </Transition>
  );
};

export default ClientsPage;
