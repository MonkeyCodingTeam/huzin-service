import type { Client } from '@entities/client';
import { CompanyTemplate } from '@shared/lib/api/target/types';

export interface Company extends Model {
  name: string;
  client_id: Client['id'];
  status: 0 | 1 | 2;
  company_template_id: CompanyTemplate['id'];
}
