import { Flex, Space, Typography } from 'antd';
import { useGetCampaignTemplatesQuery } from '@entities/campaign';
import {
  CampaignTemplateAdd,
  CampaignTemplateDelete,
  CampaignTemplateSenlerToggle,
  CampaignTemplateTagsUpdate,
} from '@features/campaign';
import { Transition } from '@shared/ui/Transition';
import css from './CampaignsSettingsPage.module.scss';

const { Text } = Typography;

const CampaignsSettingsPage = () => {
  const { data: campaignsTemplates } = useGetCampaignTemplatesQuery(null);
  return (
    <Transition className={css.campaignsSettings}>
      <section className={css.campaignsSettings__content}>
        <CampaignTemplateAdd />
      </section>
      {campaignsTemplates ? (
        <section className={css.campaignsSettings__content}>
          <Flex vertical gap={16}>
            {campaignsTemplates.map((campaignsTemplate) => (
              <Space.Compact key={campaignsTemplate.id} block>
                <Flex
                  gap={6}
                  className={css.campaignsSettings__compact}
                  align={'center'}
                  style={{ width: '100%' }}
                >
                  <Text className={css.campaignsSettings__text}>{campaignsTemplate.name} </Text>
                  <Flex justify={'space-between'} style={{ width: '100%' }}>
                    <CampaignTemplateTagsUpdate
                      templateId={campaignsTemplate.id}
                      templateTags={campaignsTemplate.tags}
                    />

                    <CampaignTemplateSenlerToggle
                      campaignId={campaignsTemplate.id}
                      isChecked={campaignsTemplate.has_senler}
                    />
                  </Flex>
                </Flex>
                <CampaignTemplateDelete campaignTemplateId={campaignsTemplate.id} />
              </Space.Compact>
            ))}
          </Flex>
        </section>
      ) : (
        <></>
      )}
    </Transition>
  );
};

export default CampaignsSettingsPage;
