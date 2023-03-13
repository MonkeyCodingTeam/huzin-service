export interface AdsAgency {
  account_id: number;
  access_role: AdsAccessRole;
  account_name: string;
  account_status: 1 | 0;
  account_type: 'agency' | 'general';
  ad_network_allowed_potentially: boolean;
  can_view_budget: boolean;
}

type AdsAccessRole = 'admin' | 'manager' | 'reports';

export interface AdsClient {
  id: number;
  name: string;
  day_limit: number;
  all_limit: number;
  ord_data: AdsOrdData;
}

export interface AdsOrdData {
  client_type: string;
  client_name: string;
  contract_number: string;
  contract_date: string;
  contract_type: string;
  contract_object: string;
  with_vat: boolean;
  inn: string;
  phone: string;
  subagent: AdsOrdSubagent;
}

// - person — физическое лицо.
// - individual — индивидуальный предприниматель.
// - legal — юридическое лицо.
type AdsOrdType = 'person' | 'individual' | 'legal';

export interface AdsOrdSubagent {
  type: AdsOrdType;
  name: string;
  inn: string;
  phone: string;
}
