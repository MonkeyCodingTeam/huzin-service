import css from './MainPage.module.scss';
import { MainPageSection } from '@pages/MainPage/ui/MainPageSection';
import { TargetRoutes } from '@app/providers/RouterProvider/lib/TargetRoutes';

const MainPage = () => {
  return (
    <div className={css.container}>
      <MainPageSection title='Таргет' items={TargetRoutes} />
    </div>
  );
};

export default MainPage;
