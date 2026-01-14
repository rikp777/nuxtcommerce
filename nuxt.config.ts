// nuxt.config.ts
import pkg from './package.json';

export default defineNuxtConfig({
  devtools: { enabled: false },

  modules: ['nuxt-graphql-request', '@vueuse/nuxt', '@nuxt/ui', '@nuxt/image', 'notivue/nuxt', '@nuxthub/core', '@nuxtjs/i18n', 'nuxt-gtag'],

  i18n: {
    defaultLocale: 'en',
    strategy: 'prefix_except_default',
    langDir: 'locales',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'root',
      alwaysRedirect: true,
    },
    locales: [
      { code: 'en', iso: 'en-GB', file: 'en-GB.json', name: '🇬🇧 English' },
      { code: 'nl', iso: 'nl-NL', file: 'nl-NL.json', name: '🇳🇱 Nederlands' },
      { code: 'de', iso: 'de-DE', file: 'de-DE.json', name: '🇩🇪 Deutsch' },
    ],
  },

  hub: {
    cache: true,
  },

  notivue: {
    position: 'top-center',
    limit: 3,
    notifications: { global: { duration: 3000 } },
  },

  css: ['notivue/notification.css', 'notivue/animations.css'],

  runtimeConfig: {
    gqlHost: process.env.GQL_HOST || '',
    public: {
      enable: {
        storeLocator: process.env.ENABLE_STORE_LOCATOR === 'true' || false,
        legal: process.env.ENABLE_LEGAL === 'true' || false
      },
      version: pkg.version,
    },
  },

  routeRules: {
    '/': { prerender: true },
    '/categories': { swr: 3600 },
    '/favorites': { swr: 600 },
  },

  nitro: {
    prerender: { routes: ['/sitemap.xml', '/robots.txt'] },
  },

  gtag: {
    id: process.env.GTAG || 'G-XXXXXXXXXX'
  },

  compatibilityDate: '2024-08-03',
});