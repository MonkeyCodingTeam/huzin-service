import { FC } from 'react';
import css from './SkeletonBlock.module.scss';

interface Props {
  width?: string;
  height?: string;
}

export const SkeletonBlock: FC<Props> = ({ width, height }) => {
  return <div className={css.skeleton} style={{ width, height }} />;
};
