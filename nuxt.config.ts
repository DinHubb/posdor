// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/ui',
    '@nuxtjs/i18n'
  ],

  devtools: {
    enabled: true
  },

  css: ['~/assets/css/main.css'],

  ui: {
    prose: true
  },

  runtimeConfig: {
    public: {
      // Ключ 2ГИС (MapGL + Places API). Публичный: всё равно виден в браузере,
      // защищается ограничением по домену в кабинете 2ГИС. Можно переопределить NUXT_PUBLIC_DGIS_KEY
      dgisKey: 'a91ea902-12ef-430d-bed1-8f19c8251d75'
    }
  },

  routeRules: {
    '/': { prerender: true },
    '/tg': { prerender: true },
    '/knowledge/**': { prerender: true },
    '/tg/knowledge/**': { prerender: true },
    '/order/**': { ssr: false },
    '/tg/order/**': { ssr: false }
  },

  compatibilityDate: '2026-06-30',

  nitro: {
    prerender: {
      crawlLinks: true,
      routes: ['/', '/tg', '/rate/A-1024', '/tg/rate/A-1024']
    }
  },

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  },

  fonts: {
    defaults: {
      subsets: ['latin', 'cyrillic', 'cyrillic-ext']
    }
  },

  i18n: {
    // Полный адрес сайта для hreflang; на GitHub Pages переопределяется NUXT_PUBLIC_I18N_BASE_URL в workflow
    baseUrl: 'http://localhost:3000',
    defaultLocale: 'ru',
    strategy: 'prefix_except_default',
    locales: [
      { code: 'ru', language: 'ru-RU', name: 'Русский', file: 'ru.json' },
      { code: 'tg', language: 'tg-TJ', name: 'Тоҷикӣ', file: 'tg.json' }
    ],
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_lang',
      redirectOn: 'root'
    }
  }
})
