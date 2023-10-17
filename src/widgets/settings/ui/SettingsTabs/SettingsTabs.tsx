import { Button, Form, Input, Space, Tabs } from 'antd';
import React from 'react';
import { ClientSettingsForm } from '@features/client';
import css from './SettingsTabs.module.scss';

export const SettingsTabs = () => {
  const [form] = Form.useForm();
  return (
    <Tabs
      className={css.tabs}
      defaultActiveKey='1'
      items={[
        {
          label: 'Настройки клиента',
          key: '1',
          children: (
            <div className={css.tabs__element}>
              <ClientSettingsForm />
            </div>
          ),
        },
        {
          label: 'Настройки группы',
          key: '2',
          children: (
            <Form form={form} onFinish={() => console.log('submited')}>
              <Space.Compact style={{ width: '100%' }}>
                <Form.Item
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
                  <Input placeholder='Ссылка на группу' />
                </Form.Item>
                <Button type={'primary'} htmlType='submit' icon={'+'} />
              </Space.Compact>
            </Form>
          ),
        },
      ]}
    />
  );
};
