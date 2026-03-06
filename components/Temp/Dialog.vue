<template lang="pug">
ElDialog.temp-dialog(:class="classes", :style="styles", :close-on-click-modal="false", append-to-body, v-bind="$attrs", v-on="$listeners")
  template(#header)
    slot(name="header")
  template
    slot
</template>

<script>
export default {

  props: ['editor', 'noheader', 'inset', 'width'],

  computed: {

    classes() {
      const classes = [];

      if (this.editor !== undefined) classes.push('temp-dialog--editor');
      if (this.noheader !== undefined) classes.push('temp-dialog--noheader');
      if (this.inset) {
        classes.push('temp-dialog--inset');
      } else {
        classes.push('temp-dialog--width');
      }
      return classes;
    },

    styles() {
      const styles = {
        '--temp-dialog--inset': this.inset,
        '--temp-dialog--width': this.width ?? '95%',
      };
      return styles;
    },

  },

};
</script>

<style lang="sass">
.temp-dialog

  & > .el-dialog > .el-dialog__body 

    h1,
    h2,
    h3,
    h4
      &:first-child
        margin-top: 0

  &--editor > .el-dialog
    display: grid
    grid-template-rows: min-content 1fr
    background: var(--background--ui-background)
    --color--form--element: var(--color--main)
    border: 5px solid var(--color--background)
    border-radius: 0

  &--editor > .el-dialog > .el-dialog__body
    overflow-y: auto

  &--editor > .el-dialog > .el-dialog__header > .el-dialog__title,
  &--editor > .el-dialog > .el-dialog__body
    color: var(--color--font-main)

  &--editor > .el-dialog > .el-dialog__header > .el-dialog__title
    font-size: 2em

  &--noheader > .el-dialog > .el-dialog__header
    padding: 0

  &--noheader > .el-dialog > .el-dialog__body
    padding-top: 0

  &--width > .el-dialog
    width: var(--temp-dialog--width)

  &--inset > .el-dialog
    position: absolute
    inset: var(--temp-dialog--inset)
    width: auto
    margin: 0 !important

</style>