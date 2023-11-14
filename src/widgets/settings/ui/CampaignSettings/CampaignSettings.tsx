import { Flex, Space, Typography } from 'antd';
import { FC } from 'react';
import { CampaignTemplate } from '@entities/campaign';
import {
  CampaignTemplateDelete,
  CampaignTemplateSenlerToggle,
  CampaignTemplateTagsUpdate,
} from '@features/campaign';
import { EmptyBlock, SkeletonBlock } from '@shared/ui';
import css from './CampaignSettings.module.scss';

const { Text } = Typography;

interface Props {
  campaignTemplate: CampaignTemplate[];
  isLoading: boolean;
}

export const CampaignSettings: FC<Props> = ({ campaignTemplate, isLoading }) => {
  if (isLoading) return <SkeletonBlock />;
  if (!campaignTemplate.length) return <EmptyBlock />;
  return (
    <div className={css.campaignSettings}>
      <Flex vertical gap={16}>
        {campaignTemplate.map((campaignTemplate) => (
          <Space.Compact key={campaignTemplate.id} block>
            <Flex
              gap={6}
              className={css.campaignSettings__compact}
              align={'center'}
              style={{ width: '100%' }}
            >
              <Text className={css.campaignSettings__text}>{campaignTemplate.name} </Text>
              <Flex justify={'space-between'} style={{ width: '100%' }}>
                <CampaignTemplateTagsUpdate
                  templateId={campaignTemplate.id}
                  templateTags={campaignTemplate.tags}
                />

                <CampaignTemplateSenlerToggle
                  campaignId={campaignTemplate.id}
                  isChecked={campaignTemplate.has_senler}
                />
              </Flex>
            </Flex>
            <CampaignTemplateDelete campaignTemplateId={campaignTemplate.id} />
          </Space.Compact>
        ))}
      </Flex>
    </div>
  );
};
