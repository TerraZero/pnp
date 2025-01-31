<template lang="pug">
.formulate-wrapper
  ZeroComponent.formulate-wrapper__layout(:comps="layout.comp", :layout="layout")
    template(v-for="(fields, slotName) in group", v-slot:[slotName])
      FormulateInput(v-for="(field, index) in fields", :key="index", v-bind="field")
</template>

<script>
export default {

  props: ['context'],

  data() {
    return {};
  },

  computed: {

    group() {
      return this.context.slotProps.component.group;
    },

    layout() {
      let layout = this.context.slotProps.component.layout ?? null;
      if (typeof layout === 'string') {
        layout = {
          comp: layout,
        };
      }
      if (layout === null) {
        layout = {
          comp: 'grid',
        };
      }
      return layout;
    },

  },

}
</script>