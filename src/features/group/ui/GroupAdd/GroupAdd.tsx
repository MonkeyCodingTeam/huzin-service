import { Group, GroupApi } from '@entities/group';
import { getOauthLink } from '@features/group/lib/getOauthLink';
import { Button, Form, Input, Space } from 'antd';
import { FC } from 'react';
import { useNavigate } from 'react-router-dom';

interface LinkProps {
  link: string;
}

interface Props {
  is_target_only?: boolean;
  afterAdd: (group: Group) => void;
}

export const GroupAdd: FC<Props> = ({ is_target_only = false, afterAdd }) => {
  const [form] = Form.useForm<LinkProps>();
  const navigate = useNavigate();

  const handleAdd = async (group: Group) => {
    afterAdd(group);
  };

  const handleSubmit = (values: LinkProps) => {
    const screenName = values.link.match(/vk.com\/(?<screen_name>[\w_.]+)/)?.groups?.screen_name;

    if (screenName) {
      GroupApi.getBy({
        group_id: screenName,
        fields: ['city', 'site'],
      }).then((res) => {
        const { id, city, place, screen_name, name, photo_200, site } = res.data.groups[0];
        const group: Group = {
          id,
          name,
          site,
          screen_name,
          photo: photo_200,
          link: `https://vk.com/${screenName}`,
          city: city?.title,
          is_target_only,
        };

        form.resetFields();

        GroupApi.create(group).then(({ data }) => {
          handleAdd(data).then(() => {
            if (data.has_access_token) return;

            const redirectBack = window.location.href;

            const url = getOauthLink(data.id, {
              redirect_uri: __APP_API_URL__ + '/api/vk-oauth/group-code',
              state: redirectBack,
            });

            window.location.href = url;
            return;
          });
        });
      });
    }
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
          <Input placeholder='Ссылка на группу' />
        </Form.Item>
        <Button type={'primary'} htmlType='submit' icon={'+'} />
      </Space.Compact>
    </Form>
  );
};
