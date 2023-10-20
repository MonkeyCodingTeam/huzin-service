export interface Group extends Model {
  name: string;
  link: string;
  screen_name: string;
  timezone?: number;
  is_target_only?: boolean;
  site?: string;
  city?: string;
  photo?: string;
  senler_token_protected?: string;
  senler_token?: string;
  has_access_token?: boolean;
}

export type GetClientGroupReq = {
  clientId: number;
};
