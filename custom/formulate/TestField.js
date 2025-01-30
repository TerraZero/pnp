import Select from '~/components/Formulate/Select.vue'

export default function (formulate) {
  formulate.extend({
    components: {
      Select,
    },
    library: {
      select: {
        classification: 'select',
        component: 'FormulateSelect',
      }
    }
  })
}