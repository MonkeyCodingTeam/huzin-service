import { type Property } from 'csstype';
import { type FC } from 'react';
import { ReactComponent as HR } from '@shared/assets/HR.svg';
import css from './Logo.module.scss';

type Props = {
  height?: Property.Height;
  width?: Property.Width;
  size?: Size;
};

export const Logo: FC<Props> = ({ height, width, size = 'md' }) => {
  return (
    <div className={css.logo}>
      <HR className={css[`logo_${size}`]} />
    </div>
  );
};
