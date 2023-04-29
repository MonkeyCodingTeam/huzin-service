import axios from 'axios';

const VkApiVersion = 5.131;

export const axiosVkInstance = axios.create({
  baseURL: __VK_API_URL__,
  headers: {
    Authorization: `Bearer ${__VK_TOKEN__}`,
  },
  params: {
    v: VkApiVersion,
  },
});

export const axiosAppInstance = axios.create({
  baseURL: `${__APP_API_URL__}/api`,
  withCredentials: true,
});

export const axiosInstance = axios.create({
  baseURL: __APP_API_URL__,
  withCredentials: true,
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
  },
});
