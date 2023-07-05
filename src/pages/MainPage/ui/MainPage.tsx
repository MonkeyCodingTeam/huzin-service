import css from './MainPage.module.scss';
import { MainPageSection } from '@pages/MainPage/ui/MainPageSection';
import { AdminRoutes, AppRoute, ContentRoutes, TargetRoutes } from '@app/providers/RouterProvider';
import { useEffect, useState } from 'react';
import { useAppSelector } from '@shared/lib/redux';
import { Role } from '@entities/user';

interface Section {
  value: AppRoute[];
  label: string;
  access?: Role['name'][];
}

const MainPage = () => {
  const user = useAppSelector((state) => state.user);
  const [sections, setSections] = useState<Section[]>([]);

  useEffect(() => {
    const sectionList: Section[] = [
      { value: TargetRoutes, label: 'Target', access: ['manager', 'accountant'] },
      { value: ContentRoutes, label: 'Content', access: ['content'] },
      { value: AdminRoutes, label: 'Admin' },
    ];

    setSections(() => {
      if (user.roles.find((role) => role.slug === 'admin')) return sectionList;

      return sectionList.filter((section) =>
        user.roles.find((role) => section.access?.find((access) => access === role.slug)),
      );
    });
  }, [user.roles]);

  return (
    <div className={css.container}>
      {sections.map((section, index) => (
        <MainPageSection key={index} title={section.label} items={section.value} />
      ))}
    </div>
  );
};

export default MainPage;
