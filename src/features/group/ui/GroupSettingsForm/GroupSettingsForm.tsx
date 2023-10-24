import { App, Col, Form, Input, InputNumber, Row, Typography } from 'antd';
import React, { FC, useEffect } from 'react';
import { Group } from '@entities/group';
import { useUpdateGroupMutation } from '@features/group';
import { SubmitFormButton } from '@shared/ui';
import css from './GroupSettingsForm.module.scss';

const { Text } = Typography;

const errorMessage = 'Произошла ошибка при обновлении!';
const errorWithoutGroup = 'Не найдена группа клиента';
const succesMessage = 'Данные обновлены!';

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
  const [updateGroup, { isLoading: isUpdating }] = useUpdateGroupMutation();
  const { message } = App.useApp();
  const [form] = Form.useForm();

  const onFinish = (values: FormValues) => {
    if (!group) {
      message.error(`Произошла ошибка: ${errorWithoutGroup}!`);
      throw Error(errorWithoutGroup);
    }
    updateGroup({ groupId: group.id, body: values })
      .unwrap()
      .then(() => {
        message.success(succesMessage);
      })
      .catch((err) => {
        message.error(`${errorMessage} ${err}`);
      });
  };

  const onFinishFailed = () => {
    message.error(errorMessage);
  };

  useEffect(() => {
    form.setFieldsValue({ timezone: group?.timezone, city: group?.city });
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
          <Input
            placeholder={group?.senler_token_protected || 'Введите ключ Senler'}
            disabled={isUpdating || isLoading}
          />
        </Form.Item>

        <div style={{ height: '40px' }}>
          <Text>Местоположение</Text>
        </div>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name='city'>
              <Input
                addonBefore={'Город'}
                placeholder='Введите название города'
                disabled={isUpdating || isLoading}
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
                disabled={isUpdating || isLoading}
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item>
          <div className={css.form__buttons}>
            <SubmitFormButton form={form} isLoading={isUpdating || isLoading} text={'Сохранить'} />
          </div>
        </Form.Item>
      </Form>
    </>
  );
};
