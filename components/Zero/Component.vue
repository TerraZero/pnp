<template lang="pug">
  component(v-if="component", ref="comp", :is="component", v-bind="$attrs", v-on="$listeners")
    template(v-for="(_, slotName) in $slots" v-slot:[slotName])
      slot(:name="slotName")
    template(v-for="(_, slotName) in $scopedSlots" v-slot:[slotName])
      slot(:name="slotName")
  .fallback(v-else)
    slot
</template>

<script>
export default {
  props: ['comps', 'fallback'],
  computed: {
    component() {
      return this.comps;
    },
  },
  methods: {
    getComp() {
      return this.$refs.comp;
    },
    hasComp() {
      return !!this.component;
    },
  },
};
</script>
