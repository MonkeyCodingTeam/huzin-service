import { Empty } from 'antd';
import css from './EmptyBlock.module.scss';

export const EmptyBlock = () => {
  return (
    <div className={css.emptyBlock}>
      <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
    </div>
  );
};
