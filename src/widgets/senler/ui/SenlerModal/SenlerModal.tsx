import { Alert, Badge, Button, List, Modal } from 'antd';
import { FC, useState } from 'react';
import { Client } from '@entities/client';
import { Link } from '@shared/ui';
import css from './SenlerModal.module.scss';
import classNames from 'classnames';

interface SenlerStats {
  client: Client;
  spent?: number;
  clicks?: number;
  subscribers?: number;
  groupId?: number;
  success: boolean;
  responsible?: { id: number; name: string };
}

interface Props {
  senlerStats: SenlerStats[];
  isLoading: boolean;
}

export const SenlerModal: FC<Props> = ({ senlerStats, isLoading }) => {
  const [openErrors, setOpenErrors] = useState(false);

  if (isLoading) {
    return (
      <Alert
        message='Загрузка...'
        type='warning'
        className={classNames(css.badge, css.badge__text)}
      />
    );
  }

  if (!senlerStats.length && !isLoading) {
    return (
      <Alert
        message='Senler подключен'
        type='success'
        className={classNames(css.badge, css.badge__text)}
      />
    );
  }

  return (
    <>
      <div className={css.badge}>
        <Badge count={senlerStats.length}>
          <Button onClick={() => setOpenErrors(true)} danger className={css.badge__text}>
            Клиенты без Senler&apos;a
          </Button>
        </Badge>
      </div>

      <Modal
        cancelButtonProps={{ hidden: true }}
        title='Клиенты'
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
          dataSource={senlerStats}
          renderItem={(stats: SenlerStats) => (
            <List.Item>
              <Link href={`/target/settings/client/${stats.client.id}`}>{stats.client.name}</Link>
            </List.Item>
          )}
        />
      </Modal>
    </>
  );
};
