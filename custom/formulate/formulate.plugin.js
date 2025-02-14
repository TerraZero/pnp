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

      json: {
        classification: 'text',
        component: 'FormulateJSON',
      },

      action: {
        classification: 'button',
        component: 'FormulateAction',
      },

      reference: {
        classification: 'text',
        component: 'FormulateReference',
        slotProps: {
          component: ['ref'],
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
