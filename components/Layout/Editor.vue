<template lang="pug">
.layout-editor(:class="classes")
  .layout-editor__topbar
    .layout-editor__title
      slot(name="title")
    .layout-editor__left
      slot(name="topleft")
    .layout-editor__right
      slot(name="topright")
  .layout-editor__main(:style="mainStyles")
    .layout-editor__content
      slot(name="content")
    .layout-editor__sidebar(:class="getClass('sidebar')", :style="sidebarStyles")
      slot(name="sidebar")
  .layout-editor__bottombar
    .layout-editor__bottomleft
      slot(name="bottomleft")
    .layout-editor__bottomright
      slot(name="bottomright")
</template>

<script>
export default {

  props: ['adapt', 'sidebar', 'sidebarfix', 'bottomstate'],

  computed: {

    classes() {
      let classes = [];

      if (this.sidebar) classes.push('sidebar');
      if (this.sidebarfix) {
        classes.push('sidebar', 'sidebar-fix');
      } else {
        classes.push('sidebar-flex');
      }
      if (this.bottomstate) classes.push('bottom-' + this.bottomstate);

      classes = classes.map(item => 'layout-editor--' + item);
      if (this.adept) classes.push(...classes.map(item => adept + '--' + item));
      return classes;
    },

    sidebarStyles() {
      const styles = {};

      if (!this.sidebarfix) {
        if (this.sidebar && typeof this.sidebar !== 'boolean') {
          styles['max-width'] = this.sidebar;
        } else {
          styles['max-width'] = '30%';
        }
      }
      return styles;
    },

    mainStyles() {
      const styles = {};

      if (this.sidebarfix) {
        styles['grid-template-columns'] = '1fr ' + this.sidebarfix;
      }
      return styles;
    },

  },

  methods: {

    getClass(element) {
      const classes = [];

      if (this.adapt) classes.push(this.adapt + '__' + element);
      return classes;
    },

  },

}
</script>

<style lang="sass">
.layout-editor
  --editor-primary: #181F37
  --editor-pen: white
  --editor-gap: .5em
  --editor-darker: #0A0D14
  --editor-sidebar: #737D96

  display: grid
  grid-template-rows: min-content 1fr min-content
  height: 100%

  &__topbar,
  &__bottombar
    display: grid
    color: var(--editor-pen)
    gap: var(--editor-gap)

  &__topbar
    grid-template-columns: max-content 1fr max-content
    background: var(--editor-primary)

  &__bottombar
    grid-template-columns: 1fr max-content
    background: var(--editor-darker)

  &--bottom-error &__bottombar
    background: var(--error)

  &__main
    position: relative
    overflow: hidden

  &--sidebar-fix &__main
    display: grid

  &__sidebar
    background: var(--editor-sidebar)

  &--sidebar-fix &__sidebar
    height: 100%
    overflow: auto

  &--sidebar-flex &__sidebar
    position: absolute
    top: 0
    right: 0
    width: 100%
    transform: translateX(100%)
    transition: transform .3s ease-in-out
    box-sizing: border-box
    height: 100%

  &--sidebar &__sidebar
    transform: translateX(0)

  &__content
    overflow: hidden

  & .el-tabs__header
    background-color: #303030
    border: none

  & .el-tabs__item
    font-weight: bold

  & .el-tabs__item.is-active
    background-color: #181818 !important
    border: none
    color: #00bdb5 !important
</style>