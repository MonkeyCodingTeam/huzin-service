export interface User extends Model {
  name: string;
  login: string;
  email: string;
  feedback_link?: string;
  telegram?: string;
  email_verified_at?: string;
  roles: Role[];
}

export interface Role {
  id: number;
  name: string;
  slug: string;
}
