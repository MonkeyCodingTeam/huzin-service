import { Ads } from '@entities/ads';
import { Alert, Badge, Button, List, Modal } from 'antd';
import { FC, useState } from 'react';

interface Props {
  errors: Ads[];
}

export const ErrorsModal: FC<Props> = ({ errors }) => {
  const [openErrors, setOpenErrors] = useState(false);

  if (!errors.length) {
    return <Alert message='Нет ошибок' type='success' />;
  }

  return (
    <>
      <Badge count={errors.length}>
        <Button onClick={() => setOpenErrors(true)} danger>
          Ошибки
        </Button>
      </Badge>
      <Modal
        cancelButtonProps={{ hidden: true }}
        title='Ошибки объявлений'
        onCancel={() => setOpenErrors(false)}
        open={openErrors}
        onOk={() => setOpenErrors(false)}
      >
        <List
          style={{
            height: '50vh',
            overflow: 'auto',
          }}
          size='small'
          bordered
          dataSource={errors}
          renderItem={(ads: Ads, index) => (
            <List.Item>
              <a
                target='_blank'
                href={`https://vk.com/ads?act=office&union_id=${ads.id}`}
                rel='noreferrer'
              >
                #{index + 1} {ads.error}
              </a>
            </List.Item>
          )}
        />
      </Modal>
    </>
  );
};
