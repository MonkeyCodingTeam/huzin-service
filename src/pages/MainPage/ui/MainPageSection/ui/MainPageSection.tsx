import { FC } from 'react';
import { Link } from 'react-router-dom';
import css from './MainPageSection.module.scss';
import classNames from 'classnames';
import { Divider } from 'primereact/divider';
import { AppRoute } from '@app/providers/RouterProvider';

interface MainPageSectionProps {
  title: string;
  items: Pick<AppRoute, 'name' | 'icon' | 'path' | 'description'>[];
}

export const MainPageSection: FC<MainPageSectionProps> = ({ title, items }) => {
  return (
    <div className={css.section}>
      <span className={css.section__title}>{title}</span>
      <div className={css.section__list}>
        {items.map((item) => (
          <Link className={css.section__list__item} to={item.path || '#'} key={item.path}>
            <div className={css.section__list__item__block}>
              <div className={css.section__list__item__title}>
                {item.icon && (
                  <i className={classNames(item.icon, css.section__list__item__icon)} />
                )}
                <span>{item.name}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
      <Divider />
    </div>
  );
};
