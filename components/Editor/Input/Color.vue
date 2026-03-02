<template lang="pug">
ElColorPicker.editor-input-color(:value="value", show-alpha, @input="onInput")
</template>

<script>
export default {

  props: ['value'],

  inject: { 
    eslot: { default: null },
  },

  computed: {

    classes() {
      const classes = [];

      return classes.map(v => 'editor-input-color--' + v);
    },

  },

  methods: {

    onInput(value) {
      this.$emit('input', value);
      this.eslot?.onItemChange(this, value);
    },

  },

}
</script>

<style lang="sass">

</style>