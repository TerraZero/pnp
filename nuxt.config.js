export default {

  head: {
    title: 'pnp',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  ssr: false,

  css: [],

  plugins: [
    '~/custom/loaders/plugin.loader.js',
  ],

  components: true,

  buildModules: [],

  modules: [
    '@nuxtjs/axios',
    '~/custom/loaders/module.loader.js',
  ],

  serverMiddleware: [
    '~/custom/server/index.js',
  ],

  axios: {
    baseURL: '/',
  },

  build: {

    transpile: [/^\\zero-/, 'uuid'],

  },

}