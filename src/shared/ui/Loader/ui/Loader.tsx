import { DotLoader } from 'react-spinners';
import { LoaderSizeProps } from 'react-spinners/helpers/props';

interface LoaderProps extends LoaderSizeProps {
  containerClassName?: string;
  loaderClassName?: string;
}

export const Loader = ({ containerClassName, loaderClassName, ...props }: LoaderProps) => {
  return (
    <div className={containerClassName}>
      <DotLoader {...props} className={loaderClassName} color={'var(--primary-color)'} />
    </div>
  );
};
