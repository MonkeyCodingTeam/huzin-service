import { useGetCampaignTemplatesQuery } from '@entities/campaign';
import { CampaignTemplateAdd } from '@features/campaign';
import { Transition } from '@shared/ui/Transition';
import { CampaignSettings } from '@widgets/settings';
import css from './CampaignsSettingsPage.module.scss';

const CampaignsSettingsPage = () => {
  const { data: campaignTemplate = [], isLoading } = useGetCampaignTemplatesQuery(null);
  return (
    <Transition className={css.campaignsSettings}>
      <section className={css.campaignsSettings__content}>
        <CampaignTemplateAdd />
      </section>
      <section>
        <CampaignSettings campaignTemplate={campaignTemplate} isLoading={isLoading} />
      </section>
    </Transition>
  );
};

export default CampaignsSettingsPage;
