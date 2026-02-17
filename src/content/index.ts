import { en } from './en';

/**
 * Get a content string by key.
 * Returns the English string, or the key itself as fallback.
 *
 * When i18n is implemented, this becomes locale-aware:
 *   getContent(key, locale) → looks up the right language map.
 */
export function getContent(key: string): string {
  return en[key] ?? key;
}

export { CONTENT } from './keys';
