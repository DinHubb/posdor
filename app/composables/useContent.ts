import type { Localized } from '~/data/site'

// l() — выбор значения демо-данных по текущему языку,
// content() — структурированные системные тексты (массивы/объекты) из файлов перевода.
export function useContent() {
  const { tm, rt, t, locale } = useI18n()

  function l<T>(value: Localized<T>): T
  function l<T>(value: Localized<T> | undefined): T | undefined
  function l<T>(value: Localized<T> | undefined) {
    if (!value) return undefined
    return locale.value === 'tg' ? value.tg : value.ru
  }

  function resolve(value: unknown): unknown {
    if (typeof value === 'string' || typeof value === 'function') return rt(value as Parameters<typeof rt>[0])
    if (Array.isArray(value)) return value.map(resolve)
    if (value && typeof value === 'object') {
      if ('type' in value && ('b' in value || 'body' in value)) return rt(value as Parameters<typeof rt>[0])
      return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, resolve(v)]))
    }
    return value
  }

  function content<T>(key: string) {
    return computed(() => {
      void locale.value
      return resolve(tm(key)) as T
    })
  }

  function price(n: number) {
    return t('common.price', { n: n.toLocaleString('ru-RU') })
  }

  function plusPrice(n: number) {
    return t('common.plusPrice', { n: n.toLocaleString('ru-RU') })
  }

  return { l, content, price, plusPrice }
}
