<template lang="pug">
.editor-input-inline
  ZeroComponent(v-if="comp", :comps="comp", :value="value", @input="$emit('input', $event)")
    | No componente found "{{ comp }}"
</template>

<script>
export default {

  props: ['comp', 'value'],

  provide() {
    return {
      inline: this,
    };
  },

  watch: {

    mount: {
      handler(value) {
        this.$emit('input', value);
      },
      deep: true,
    },

  },

  data() {
    return {
      mount: JSON.parse(JSON.stringify(this.value)),
    };
  },

  methods: {

    setValue(key, value) {
      this.mount[key] = value;
    },

  },

}
</script>

<style lang="sass">

</style>