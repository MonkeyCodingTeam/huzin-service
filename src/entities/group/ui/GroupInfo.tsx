import { LoadingOutlined } from '@ant-design/icons';
import { Avatar, Typography } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useLazyGetClientGroupQuery } from '@entities/group/api/groupAPI';
import css from './GroupInfo.module.scss';

const { Text, Title } = Typography;

interface Time {
  hour: number;
  minute: number;
}

export const GroupInfo = () => {
  const [trigger, { data: group, isFetching }] = useLazyGetClientGroupQuery();
  const [time, setTime] = useState<Time>();
  const client = useSelector((state: RootState) => state.selectedClient);

  useEffect(() => {
    if (!client?.id) return;
    trigger({ clientId: client.id }, true);
  }, [client]);

  useEffect(() => {
    if (!group) return;
    if (group.timezone === undefined || null) return;
    setTime({ hour: +dayjs().format('HH') + group.timezone, minute: +dayjs().format('mm') });
  }, [group]);

  console.log(group);

  return (
    <div className={css.groupInfo}>
      {isFetching ? (
        <LoadingOutlined spin={true} style={{ display: 'flex', margin: '0 auto' }} />
      ) : !group?.id ? (
        <div className={css.groupInfo__withoutGroup}>
          <Title level={5} type={'secondary'}>
            Группа не указана
          </Title>
        </div>
      ) : (
        <>
          <div className={css.groupInfo__imageContainer}>
            <Avatar shape='square' size={48} src={group.photo} />
            <Text className={css.groupInfo__type}>Группа</Text>
          </div>
          <div className={css.groupInfo__infoContainer}>
            <Title
              title={group.name}
              ellipsis={true}
              level={5}
              className={css.groupInfo__title}
              onClick={() => window.open(group.link, '_blank')}
            >
              {group.name}
            </Title>

            <Text>Город: {group.city}</Text>
            <Text>
              Местное время: {time ? `${time.hour}:${time.minute}` : 'часовой пояс не указан'}
            </Text>
          </div>
        </>
      )}
    </div>
  );
};
