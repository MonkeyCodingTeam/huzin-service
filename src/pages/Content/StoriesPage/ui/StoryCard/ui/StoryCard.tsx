import { Story } from '@entities/story';
import { FC } from 'react';
import { ContentAPI } from '@entities/content';
import css from './StoryCard.module.scss';
import { DateTime } from 'luxon';
import { PrimeIcons } from 'primereact/api';
import classNames from 'classnames';

interface StoryCardProps {
  story: Story;
}

export const StoryCard: FC<StoryCardProps> = ({ story }) => {
  const content = () => {
    const { mime, path, name } = story.content;
    const contentUri = ContentAPI.get(path);

    return mime.match(/^video\//) ? (
      <video src={contentUri} className={css.card__block__media} controls />
    ) : (
      <img
        alt={name}
        title={name}
        role='presentation'
        src={contentUri}
        className={css.card__block__media}
      />
    );
  };

  const publishDate = DateTime.fromSQL(story.locale_date).toFormat('dd.LL HH:mm');

  return (
    <div className={css.card}>
      <div className={css.card__block}>
        <div className={css.card__block__tools}>
          <b>{publishDate}</b>
          <i className={classNames(PrimeIcons.TIMES, css.card__block__tools__close)} />
        </div>
        {content()}
      </div>
    </div>
  );
};
