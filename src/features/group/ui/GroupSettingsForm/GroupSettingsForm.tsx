import { Button, Col, Form, Input, InputNumber, message, Row, Typography } from 'antd';
import React, { FC, useEffect } from 'react';
import { Group } from '@entities/group';
import { useUpdateGroupMutation } from '@features/group';
import css from './GroupSettingsForm.module.scss';

const { Text } = Typography;

interface FormValues {
  senlerKey: string;
  timezone: Group['timezone'];
  city: Group['city'];
}

interface Props {
  group?: Group;
  isLoading?: boolean;
}

export const GroupSettingsForm: FC<Props> = ({ group, isLoading }) => {
  const [updateGroup] = useUpdateGroupMutation();

  const [form] = Form.useForm();

  const onFinish = (values: FormValues) => {
    console.log(values);
    if (!group) return;
    updateGroup({ groupId: group.id, body: values });
  };

  const onFinishFailed = () => {
    message.error('Submit failed!');
  };

  useEffect(() => {
    form.setFieldsValue({ ['timezone']: group?.timezone, ['city']: group?.city });
  }, [group]);

  return (
    <>
      <Form
        form={form}
        layout='horizontal'
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete='off'
      >
        <Form.Item name='senler_token_protected' label='Ключ Senler' labelCol={{ span: 24 }}>
          <Input placeholder={group?.senler_token_protected || 'Введите ключ Senler'} />
        </Form.Item>

        <div style={{ height: '40px' }}>
          <Text>Местоположение</Text>
        </div>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name='city'>
              <Input
                addonBefore={'Город'}
                disabled={isLoading}
                placeholder='Введите название города'
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name='timezone'>
              <InputNumber
                style={{ width: '100%' }}
                addonBefore={'Часовой пояс'}
                placeholder='Введите часовой пояс +/-'
                min='-12'
                max='14'
                step='1'
                disabled={isLoading}
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item shouldUpdate>
          {() => (
            <div className={css.form__buttons}>
              <Button
                type='primary'
                htmlType='submit'
                loading={isLoading}
                disabled={!!form.getFieldsError().filter(({ errors }) => errors.length).length}
              >
                Сохранить
              </Button>
            </div>
          )}
        </Form.Item>
      </Form>
    </>
  );
};
