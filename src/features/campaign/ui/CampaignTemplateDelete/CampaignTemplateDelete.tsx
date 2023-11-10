import { DeleteOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { FC } from 'react';
import { CampaignTemplate } from '@entities/campaign';
import { useDeleteCampaignMutation } from '@features/campaign';

interface Props {
  campaignTemplateId: CampaignTemplate['id'];
}

export const CampaignTemplateDelete: FC<Props> = ({ campaignTemplateId }) => {
  const [campaignDelete, { isLoading }] = useDeleteCampaignMutation();

  return (
    <Button
      danger
      style={{ height: 'inherit' }}
      icon={<DeleteOutlined />}
      onClick={() => {
        campaignDelete(campaignTemplateId);
      }}
      loading={isLoading}
    />
  );
};
