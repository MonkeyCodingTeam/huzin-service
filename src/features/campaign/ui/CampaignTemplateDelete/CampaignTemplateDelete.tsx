import { DeleteOutlined, LoadingOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { Button, Popconfirm } from 'antd';
import React, { FC } from 'react';
import { CampaignTemplate } from '@entities/campaign';
import { useDeleteCampaignMutation } from '@features/campaign';

interface Props {
  campaignTemplateId: CampaignTemplate['id'];
}

export const CampaignTemplateDelete: FC<Props> = ({ campaignTemplateId }) => {
  const [campaignDelete, { isLoading }] = useDeleteCampaignMutation();

  return (
    <Popconfirm
      title='Удаление рекламной компании'
      description='Вы уверены что хотите удалить рекламную компанию?'
      okText='Да'
      cancelText='Нет'
      placement='bottomRight'
      icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
      onConfirm={() => {
        campaignDelete(campaignTemplateId);
      }}
    >
      <Button type='default' danger style={{ height: 'auto', padding: '0 12px' }}>
        {isLoading ? <LoadingOutlined spin /> : <DeleteOutlined />}
      </Button>
    </Popconfirm>
  );
};
