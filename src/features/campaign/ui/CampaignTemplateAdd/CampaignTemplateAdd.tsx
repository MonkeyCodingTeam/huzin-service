import { Button, Form, Input, Space, Typography } from 'antd';
import React from 'react';
import { CampaignTemplate } from '@entities/campaign';
import { useAddCampaignMutation } from '@features/campaign';

interface CampaignProps {
  name: CampaignTemplate['name'];
}

const { Title } = Typography;

export const CampaignTemplateAdd = () => {
  const [addCampaign, { isLoading }] = useAddCampaignMutation();

  const handleSubmit = (values: CampaignProps) => {
    addCampaign(values);
    form.resetFields();
  };

  const [form] = Form.useForm<CampaignProps>();
  return (
    <Form form={form} onFinish={handleSubmit}>
      <div style={{ width: 'fit-content', marginBottom: '24px' }}>
        <Title level={4}>Добавить рекламную компанию</Title>
      </div>
      <Space.Compact style={{ width: '100%' }}>
        <Form.Item
          style={{ width: '100%' }}
          name={'name'}
          rules={[
            {
              required: true,
              message: 'Необходимо указать название рекламной компании',
            },
          ]}
        >
          <Input placeholder='Введите название рекламной компании' />
        </Form.Item>

        <Button type={'primary'} htmlType='submit' loading={isLoading}>
          Добавить
        </Button>
      </Space.Compact>
    </Form>
  );
};
