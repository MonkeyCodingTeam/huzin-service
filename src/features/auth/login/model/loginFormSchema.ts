import { z } from 'zod';

export const loginFormSchema = z.object({
  login: z.string().min(1, { message: 'Логин обязательно' }),
  password: z.string().min(6, { message: 'Пароль должен быть длиннее 8 символов' }),
  remember: z.boolean(),
});

export type LoginFormSchema = z.infer<typeof loginFormSchema>;
