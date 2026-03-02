<template lang="pug">
ElSwitch.editor-input-switch(:value="transformed", :class="classes", :active-text="label", active-color="#00bdb5", @input="onInput")
</template>

<script>
export default {

  props: ['value', 'label', 'border', 'on', 'off'],

  inject: { 
    eslot: { default: null },
  },

  computed: {

    classes() {
      const classes = [];

      if (this.border !== undefined) classes.push('border');
      return classes.map(v => 'editor-input-switch--' + v);
    },

    transformed() {
      if (this.on !== undefined && this.value === this.on) {
        return true;
      } else if (this.off !== undefined && this.value === this.off) {
        return false;
      }
      return this.value;
    },

  },

  methods: {

    onInput(value) {
      if (value && this.on !== undefined) {
        this.$emit('input', this.on);
        this.eslot?.onItemChange(this, this.on);
      } else if (!value && this.off !== undefined) {
        this.$emit('input', this.off);
        this.eslot?.onItemChange(this, this.off);
      } else {
        this.$emit('input', value);
        this.eslot?.onItemChange(this, value);
      }
    },

  },

}
</script>

<style lang="sass">
.editor-input-switch
  margin: 0 !important
  color: white 
  background: #333

  &--border
    border: 1px solid white
    border-radius: 4px
    padding: .2em

  .el-switch__label
    color: white

</style>