import { ReactNode } from 'react';
import { ROUTES } from '@shared/const/routes';
import { BudgetCutsPage, ProjectsPage } from '@pages/Target';
import { StubPage } from '@pages/StubPage';

interface AppRoute {
  element: ReactNode;
  path: ROUTES;
  protected: boolean;
}

export const appRoutes: AppRoute[] = [
  {
    element: <ProjectsPage />,
    path: ROUTES.TargetProjects,
    protected: true,
  },
  {
    element: <BudgetCutsPage />,
    path: ROUTES.BudgetCuts,
    protected: true,
  },
  {
    element: <StubPage />,
    path: ROUTES.TargetCompanies,
    protected: true,
  },
  {
    element: <StubPage />,
    path: ROUTES.TargetSettings,
    protected: true,
  },
];
