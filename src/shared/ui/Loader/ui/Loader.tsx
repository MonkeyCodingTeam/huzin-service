import { DotLoader } from 'react-spinners';
import css from './Loader.module.scss';
import { LoaderSizeProps } from 'react-spinners/helpers/props';

export const Loader = ({ ...props }: LoaderSizeProps) => {
  return (
    <div className={css.container}>
      <DotLoader {...props} />
    </div>
  );
};
