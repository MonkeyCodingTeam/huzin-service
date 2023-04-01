export interface ResolveScreenNameResponse {
  type: 'user' | 'group' | 'event' | 'page' | 'application' | 'vk_app';
  object_id: number;
}
