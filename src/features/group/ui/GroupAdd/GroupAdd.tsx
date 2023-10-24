import { App, Button, Form, Input, Space, Typography } from 'antd';
import React from 'react';
import { useSelector } from 'react-redux';
import { getOauthLink, useCreateGroupMutation, useLazyGetVKGroupByQuery } from '@features/group';
import { env } from '@shared/const';

const { Title } = Typography;

interface LinkProps {
  link: string;
}

export const GroupAdd = () => {
  const client = useSelector((state: RootState) => state.selectedClient);

  const [getVKGroup, { isFetching }] = useLazyGetVKGroupByQuery();
  const [createGroup] = useCreateGroupMutation();

  const { message } = App.useApp();
  const [form] = Form.useForm<LinkProps>();

  const handleSubmit = (values: LinkProps) => {
    const screenName = values.link.match(/vk.com\/(?<screen_name>[\w_.]+)/)?.groups?.screen_name;
    if (!screenName) return;
    getVKGroup({ group_id: screenName, fields: ['city', 'site'] })
      .unwrap()
      .then((res) => {
        form.resetFields();
        createGroup({ clientId: client.id, body: res })
          .unwrap()
          .then((res) => {
            message.success('Группа добавлена');
            if (res.has_access_token) return;

            const redirectBack = window.location.href;
            window.location.href = getOauthLink(res.id, {
              redirect_uri: env.API_URL + '/api/vk-oauth/group-code',
              state: redirectBack,
            });
          });
      })
      .catch((err) => {
        // TODO Добавить обработчик
        console.log(err);
      });
  };

  return (
    <Form form={form} onFinish={handleSubmit}>
      <div style={{ width: 'fit-content', marginBottom: '24px' }}>
        <Title level={3}>Добавить группу</Title>
      </div>

      <Space.Compact style={{ width: '100%' }}>
        <Form.Item
          extra={'Для доступа к настройкам необходимо указать ссылку на группу'}
          style={{ width: '100%' }}
          name={'link'}
          rules={[
            {
              pattern: /vk.com\/\w+/,
              message: 'Некорректный формат ссылки',
            },
            {
              required: true,
              message: 'Ссылка не должна быть пустой',
            },
          ]}
        >
          <Input placeholder='Введите ссылку на группу' disabled={isFetching} />
        </Form.Item>

        <Button type={'primary'} htmlType='submit' loading={isFetching}>
          Добавить
        </Button>
      </Space.Compact>
    </Form>
  );
};
