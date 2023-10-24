import { z } from 'zod';

const envVariables = z.object({
  VITE_MODE: z.enum(['development', 'production']).optional(),
  VITE_API_URL: z.string().url(),
  VITE_APP_TITLE: z.string().min(1).optional(),
  VITE_API_DELAY: z.string().regex(/^\d+$/, { message: 'Must be a positive number' }).optional(),
  VITE_DOMAIN: z.string(),
  VITE_TELEGRAM_BOT: z.string().min(1),
});

envVariables.parse(import.meta.env);

declare global {
  interface ImportMetaEnv extends z.infer<typeof envVariables> {}
}

export const env = {
  MODE: import.meta.env.VITE_MODE,
  API_URL: import.meta.env.VITE_API_URL,
  APP_TITLE: import.meta.env.VITE_APP_TITLE,
  API_DELAY: import.meta.env.VITE_API_DELAY,
  DOMAIN: import.meta.env.VITE_DOMAIN,
  TELEGRAM_BOT: import.meta.env.VITE_TELEGRAM_BOT,

  VK_API_URL: import.meta.env.VITE_VK_API_URL,
  VK_CLIENT_ID: import.meta.env.VITE_VK_CLIENT_ID,
  VK_VERSION: import.meta.env.VITE_VK_VERSION,
  VK_AGENCY: import.meta.env.VITE_VK_AGENCY,
} as const;
