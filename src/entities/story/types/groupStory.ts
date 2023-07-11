import { User } from '@entities/user';
import { Group } from '@entities/group';
import { Content } from '@entities/content';

export interface CreateStory {
  content: File;
  date: Date;
  with_linked: boolean;
}

export interface Story {
  id: number;
  created_by: User['id'];
  updated_by?: User['id'];
  group_id: Group['id'];
  content: Content;
  date: string;
  locale_date: string;
  is_published: boolean;
  error: boolean;
}
