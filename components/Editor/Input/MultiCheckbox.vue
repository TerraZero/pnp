<template lang="pug">
.editor-input-multi-checkbox(:style="styles")
  ElCheckbox.editor-input-multi-checkbox__checkbox(v-for="option, key in options", :key="key", :label="option", :value="(value ?? {})[key]", @input="onInput(key, $event)", border)
</template>

<script>
export default {

  props: ['value', 'options', 'size'],

  computed: {

    styles() {
      const styles = {};

      if (this.size) {
        styles['grid-template-columns'] = 'repeat(auto-fill, minmax(' + this.size + ', 1fr))';
      }
      return styles;
    },

  },

  methods: {

    onInput(key, value) {
      const data = JSON.parse(JSON.stringify(this.value ?? {}));
      data[key] = value;
      this.$emit('input', data);
    },

  },

}
</script>

<style lang="sass">
.editor-input-multi-checkbox
  display: grid
  gap: 1em

  &__checkbox
    margin: 0 !important
    color: white

</style>