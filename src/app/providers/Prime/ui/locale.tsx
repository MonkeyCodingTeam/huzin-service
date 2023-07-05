import { addLocale, locale } from 'primereact/api';
import type { FC, ReactNode } from 'react';
import { getLocale } from '@app/providers/Prime/lib';
import type { LocaleLangType } from '@app/providers/Prime/types';

interface PrimeLocaleProps {
  children: ReactNode;
  localeLang: LocaleLangType;
}

export const Locale: FC<PrimeLocaleProps> = ({ children, localeLang = 'ru' }) => {
  const currentLocale = getLocale('ru');
  addLocale(currentLocale.locale, currentLocale.options);

  locale(localeLang);

  return <>{children}</>;
};
