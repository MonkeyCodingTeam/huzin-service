import { PlusOutlined } from '@ant-design/icons';
import { App, Button, Form, Input, Space } from 'antd';
import { Group, useLazyGetVKGroupByQuery } from '@entities/group';

interface LinkProps {
  link: string;
}

export const GroupAdd = () => {
  const [trigger, { isFetching }] = useLazyGetVKGroupByQuery();
  const [form] = Form.useForm<LinkProps>();
  const { message } = App.useApp();

  const handleSubmit = (values: LinkProps) => {
    const screenName = values.link.match(/vk.com\/(?<screen_name>[\w_.]+)/)?.groups?.screen_name;
    console.log(screenName);
    if (!screenName) return;
    trigger({ group_id: screenName, fields: ['city', 'site'] })
      .unwrap()
      .then((res) => {
        message.success('Группа успешно добавлена!');
        // TODO перенести в transformResponse
        const { id, city, screen_name, name, photo_200, site } = res.groups[0];
        const group: Group = {
          id,
          name,
          site,
          screen_name,
          photo: photo_200,
          link: `https://vk.com/${screenName}`,
          city: city?.title,
        };
        console.log(group);
      })
      .catch((err) => {
        message.error('Произошла ошибка: ' + err);
        console.log(err);
      })
      .finally(() => {
        form.resetFields();
      });
  };

  return (
    <Form form={form} onFinish={handleSubmit}>
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
          <Input placeholder='Ссылка на группу' disabled={isFetching} />
        </Form.Item>
        <Button type={'primary'} htmlType='submit' icon={<PlusOutlined />} loading={isFetching} />
      </Space.Compact>
    </Form>
  );
};
