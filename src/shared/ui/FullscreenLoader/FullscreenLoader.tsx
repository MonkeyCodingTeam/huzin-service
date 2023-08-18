import { Spin } from 'antd';
import css from './FullscreenLoader.module.scss';

export const FullscreenLoader = () => {
  return (
    <div className={css.root}>
      <div className={css.root__box}>
        <Spin size='large' />
      </div>
    </div>
  );
};
