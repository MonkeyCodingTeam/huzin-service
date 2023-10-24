import { Avatar, Typography } from 'antd';
import dayjs from 'dayjs';
import { FC, ReactNode, useEffect, useState } from 'react';
import { Group } from '@entities/group';
import css from './GroupInfo.module.scss';

const { Text, Title } = Typography;

interface Props {
  // TODO Переделать после изменения бэка
  group?: Group;
  actions?: ReactNode;
}

export const GroupInfo: FC<Props> = ({ group, actions }) => {
  const [time, setTime] = useState<String>();

  useEffect(() => {
    if (!group) return;
    const time = dayjs()
      .add(group.timezone || 0, 'hour')
      .format('HH:mm');
    setTime(time);
  }, [group]);

  if (!group?.id) {
    return (
      <div className={css.groupInfo}>
        <div className={css.groupInfo__withoutGroup}>
          <Title level={5} type={'secondary'}>
            Группа не указана
          </Title>
        </div>
      </div>
    );
  }

  return (
    <div className={css.groupInfo} style={{ justifyContent: group ? 'space-between' : 'center' }}>
      <div className={css.groupInfo__container}>
        <div className={css.groupInfo__imageContainer}>
          <Avatar shape='square' size={80} src={group.photo} />
        </div>
        <div className={css.groupInfo__infoContainer}>
          <Title title={group.name} ellipsis={true} level={5} className={css.groupInfo__title}>
            <a href={group.link} target={'_blank'} rel='noreferrer'>
              {group.name}
            </a>
          </Title>
          <Text>Город: {group.city || 'Не указан'}</Text>
          <Text>Местное время: {time}</Text>
        </div>
      </div>
      {group && actions}
    </div>
  );
};
