<template lang="pug">
.editor-input-switches(:style="styles")
  ElSwitch.editor-input-switches__switch(v-for="option, key in options", :key="key", :active-text="option", :value="(value ?? {})[key]", active-color="#00bdb5", @input="onInput(key, $event)")
</template>

<script>
export default {

  props: ['value', 'options', 'size'],

  inject: { 
    eslot: { default: null },
  },

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
      this.eslot?.onItemChange(this, data);
    },

  },

}
</script>

<style lang="sass">
.editor-input-switches
  display: grid
  gap: 1em

  &__switch
    margin: 0 !important
    color: white

  &__switch .el-switch__label
    color: white

</style>