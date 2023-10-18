import { Group } from '@entities/group';
import { FC } from 'react';
import css from './GroupTitle.module.scss';
import { Badge } from 'antd';

interface Props {
  group?: Group;
}

export const GroupTitle: FC<Props> = ({ group }) => {
  if (!group) return <></>;

  return (
    <div className={css.root}>
      <a
        target={'_blank'}
        href={`https://vk.com/public${group.id}`}
        className={css.root__title}
        rel='noreferrer'
      >
        {group.name}
      </a>
      {!group.has_access_token && (
        <Badge
          title='У группы нет токена, нужно снова добавить группу'
          status='error'
          text='Нет токена'
        />
      )}
    </div>
  );
};
