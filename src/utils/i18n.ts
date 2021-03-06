import { IntlMessageFormat } from 'intl-messageformat'
import { error, fatal, warn } from './logger'
import { languages } from '../cache'

const defaultLang = process.env.WILDBEAST_LANGUAGE ?? 'en-US'

export function translate (key: string, args?: Record<string, any>, lang?: string): string {
  if (!languages.has(defaultLang)) {
    fatal(`Default language ${defaultLang} not found in cache!`, 'i18n')
  }
  if (lang !== undefined && !languages.has(lang)) {
    warn(`A translation call requested language ${lang}, but it's not found in cache. Defaulting back to ${defaultLang}`, 'i18n')
    lang = defaultLang
  }
  try {
    const msg = traverse(key, lang)
    if (!(typeof msg === 'string') && lang !== defaultLang) {
      warn(`Translation key ${key} for language ${lang ?? defaultLang} not found in cache! Retrying for default language`, 'i18n')
      return translate(key, args, defaultLang)
    } else if (!(typeof msg === 'string')) error(`Translation key ${key} for default language not found in cache!`, 'i18n')
    return new IntlMessageFormat(typeof msg === 'string' ? msg : '[TRANSLATION FAILED]').format(args)
  } catch (e) {
    error(`Failed to translate ${key}`, 'i18n')
    error(e as any, 'i18n')
    return '[TRANSLATION FAILED]'
  }
}

// get the translated value for all languages
export function allForKey (key: string, args?: Record<string, any>): Record<string, any> {
  const result: Record<string, any> = {}
  for (const lang of languages.keys()) {
    result[lang] = translate(key, args, lang)
  }
  return result
}

export function traverse (key: string, lang?: string): any {
  return key.split('.').reduce((o, i) => o?.[i], lang !== undefined ? languages.get(lang) : languages.get(defaultLang)) as any
}
