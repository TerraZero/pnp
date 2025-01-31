import VueFormulate from '@braid/vue-formulate';

export default () => {
  VueFormulate.extend({
    library: {

      autocomplete: {
        classification: 'text',
        component: 'FormulateAutocomplete',
        slotProps: {
          component: ['search'],
        },
      },

      wrapper: {
        component: 'FormulateWrapper',
        slotProps: {
          component: ['group', 'layout'],
        },
      },

    },
  });
}
