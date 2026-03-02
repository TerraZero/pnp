<template lang="pug">
.editor-tool-action-wrap(:class="classes")
  EditorToolLabel(:label="label")
  .editor-tool-action-wrap__wrapper
    .editor-tool-action-wrap__slot(:style="slotStyle")
      slot
    ElButtonGroup
      ElButton.editor-tool-action-wrap__button(v-for="button in buttons", :key="button.key || button.icon", v-bind="button", @click="$emit('click', button)", size="mini")
</template>

<script>
export default {

  props: ['label', 'buttons', 'size', 'grid'],

  computed: {

    classes() {
      const classes = [];

      if (this.size === undefined || this.size === '') {
        classes.push('size-default');
      } else if (this.size) {
        classes.push('size-' + this.size);
      }
      if (this.grid) classes.push('grid');
      return classes.map(v => 'editor-tool-action-wrap--' + v);
    },

    slotStyle() {
      const style = {};

      if (this.grid) {
        style['grid-template-columns'] = this.grid;
      }
      return style;
    },

  },

}
</script>

<style lang="sass">
.editor-tool-action-wrap

  &__wrapper
    display: grid
    grid-template-columns: 1fr max-content

  &__button
    height: 100%

  &--size-default &__button
    font-size: 1.5em

  &__button.el-button--primary
    background-color: #00bdb5

  &--grid &__slot
    display: grid
</style>