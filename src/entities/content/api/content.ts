const BASE = `${__APP_API_URL__}/storage`;

export const ContentAPI = {
  get: (path: string) => `${BASE}/${path}`,
};
