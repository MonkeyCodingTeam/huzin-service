import axios from 'axios';

const VkApiVersion = 5.131;

const BASE_URL = `${__APP_API_URL__}/api`;

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
  baseURL: BASE_URL,
  withCredentials: true,
});

export const axiosTargetInstance = axios.create({
  baseURL: `${BASE_URL}/target`,
  withCredentials: true,
});

export const axiosContentInstance = axios.create({
  baseURL: `${BASE_URL}/content`,
  withCredentials: true,
});

export const axiosInstance = axios.create({
  baseURL: __APP_API_URL__,
  withCredentials: true,
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
  },
});
