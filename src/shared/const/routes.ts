export enum TARGET_ROUTES {
  Clients = '/target/client',
  Client = '/target/client/:clientId',
  BudgetCuts = '/target/budget-cuts',
  Companies = '/target/company',
  Settings = '/target/settings',
  SettingsClients = '/target/settings/*',
  SettingsClient = '/target/settings/client/:clientId',
  SettingsCompanies = '/target/settings/company',
  ClientReport = '/client_report/:clientId/:token',
}

enum AUTH_ROUTES {
  Login = '/login',
}

export const ROUTES = {
  TARGET: TARGET_ROUTES,
  AUTH: AUTH_ROUTES,
};

export type RouteList = TARGET_ROUTES | AUTH_ROUTES;
