import { Client } from '@entities/client/types';

export const redirectToVK = (client?: Client) => {
  if (!window) {
    return;
  }
  // @ts-ignore
  window.open(`https://vk.com/ads?act=office&union_id=${client.id}`, '_blank').focus();
};
