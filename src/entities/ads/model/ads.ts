export interface Ads extends Model {
  company_id: number;
  client_id: number;
  error: null | string;
  link_url: string;
  post_id: null | string;
  is_checked: boolean;
  is_active: boolean;
  published_at: string;
}
