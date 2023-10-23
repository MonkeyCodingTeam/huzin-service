import { Group } from '@entities/group';
import { env } from '@shared/const';

type GroupScope = 'stories' | 'photos' | 'app_widget' | 'messages' | 'docs' | 'manage';

interface Options {
  redirect_uri: string;
  display?: 'page' | 'popup' | 'mobile';
  scope?: GroupScope[];
  response_type?: 'code' | 'token';
  state?: string;
}

const BASE_URL = 'https://oauth.vk.com/authorize';

export const getOauthLink = (groupId: Group['id'], options: Options) => {
  const url = new URL(BASE_URL);

  const {
    display = 'page',
    scope = ['app_widget', 'docs', 'messages', 'manage', 'photos', 'stories'],
    response_type = 'code',
    state,
    redirect_uri,
  } = options;

  url.searchParams.append('client_id', env.VK_VK_CLIENT_ID);
  url.searchParams.append('redirect_uri', redirect_uri);
  url.searchParams.append('v', '5.131');

  url.searchParams.append('display', display);
  url.searchParams.append('group_ids', groupId.toString());
  url.searchParams.append('scope', scope.join(','));
  url.searchParams.append('response_type', response_type);

  if (state) {
    url.searchParams.append('state', state);
  }

  return url.href;
};
