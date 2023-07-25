import { Story } from '@entities/story';
import { FC, MouseEvent } from 'react';
import { ContentAPI } from '@entities/content';
import css from './StoryCard.module.scss';
import { DateTime } from 'luxon';
import { PrimeIcons } from 'primereact/api';
import classNames from 'classnames';

interface StoryCardProps {
  story: Story;
  removeStory: (e: MouseEvent<HTMLElement>, story: Story) => void;
}

export const StoryCard: FC<StoryCardProps> = ({ story, removeStory }) => {
  const publishDate = DateTime.fromSQL(story.locale_date).toFormat('dd.LL HH:mm');
  const mskDate = DateTime.fromSQL(story.date).toFormat('dd.LL HH:mm');

  const content = () => {
    const { mime, path, name } = story.content;
    const contentUri = ContentAPI.get(path);

    return mime.match(/^video\//) ? (
      <video className={css.card__block__media} controls controlsList='nofullscreen'>
        <source src={contentUri} />
      </video>
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

  const alert = () => {
    if (story.is_published) {
      return (
        <div title='Опубликовано' className={classNames(css.alert, css.alert_success)}>
          Опубликовано
        </div>
      );
    }

    if (DateTime.fromSQL(story.date) < DateTime.now()) {
      return (
        <div title='Просрочен' className={classNames(css.alert, css.alert_warning)}>
          Просрочен
        </div>
      );
    }
  };

  return (
    <div className={css.card}>
      <div className={css.card__block}>
        <div className={css.card__block__tools}>
          <div className={css.card__block__date}>
            <span>{publishDate}</span>
            <span title='Время публикации по МСК' className={css.card__block__date_secondary}>
              ({mskDate})
            </span>
          </div>
          <i
            onClick={(e) => {
              removeStory(e, story);
            }}
            className={classNames(PrimeIcons.TIMES, css.card__block__tools__close)}
          />
        </div>
        {content()}
        {alert()}
      </div>
    </div>
  );
};
