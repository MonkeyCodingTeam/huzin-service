import type { AppRoute } from '@app/providers/RouterProvider';
import type { Role } from '@entities/user';

export enum TARGET_ROUTES {
  Clients = '/target/client',
  Client = '/target/client/:clientId',
  BudgetCuts = '/target/budget-cuts',
  Companies = '/target/company',
  Invoice = 'target/invoice',
  Settings = '/target/settings',
  SettingsClients = '/target/settings/*',
  SettingsClient = '/target/settings/client/:clientId',
  SettingsCompanies = '/target/settings/company',
  ClientReport = '/client_report/:clientId/:token',
}

export enum CONTENT_ROUTES {
  Stories = '/content/stories',
  StoriesGroup = '/content/stories/group/:groupId',
  Settings = '/content/settings',
  GroupsSettings = '/content/settings/group',
  GroupSettings = '/content/settings/group/:groupId',
  TagsSettings = '/content/settings/tag',
}

export enum ADMIN_ROUTES {
  Reports = '/admin/reports',
}

enum AUTH_ROUTES {
  Login = '/login',
}

export const ROUTES = {
  TARGET: TARGET_ROUTES,
  CONTENT: CONTENT_ROUTES,
  ADMIN: ADMIN_ROUTES,
  AUTH: AUTH_ROUTES,
};

export interface appService {
  value: AppRoute[];
  label: string;
  base: string;
  access?: Role['slug'][];
}
