import { createIntl, createIntlCache } from 'react-intl';
import en from './lang/en.json';
import th from './lang/th.json';

const cache = createIntlCache();

export const defaultLocale = 'en';

export const locales = ['en', 'th', 'cn'];

export const messages = {
  en,
  th,
};

export function getIntl(locale) {
  return createIntl(
    {
      locale,
      messages: messages[locale],
    },
    cache
  );
}
