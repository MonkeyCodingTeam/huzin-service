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
