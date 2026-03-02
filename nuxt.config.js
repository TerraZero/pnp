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

  css: [
    '@fortawesome/fontawesome-svg-core/styles.css',
    'rpg-awesome/css/rpg-awesome.css',
    '~/plugins/dicefont/dicefont.css',
    'element-ui/lib/theme-chalk/index.css',
    '~/custom/styles/index.sass',
  ],

  plugins: [
    '~/plugins/storeutil.js',
    '~/plugins/element.js',
    '~/plugins/shortkey.js',
    '~/plugins/jsoneditor.js',
    '~/plugins/debounce.js',
    '~/plugins/fontawesome.js',
    '~/custom/formulate/formulate.plugin.js',
    '~/custom/loaders/plugin.loader.js',
  ],

  components: true,

  buildModules: ['@braid/vue-formulate/nuxt'],

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

    transpile: [/^(\\|\/)zero-/, 'uuid', 'json-editor-vue'],

  },

}