<template lang="pug">
component.editor-tool-label(:is="tag")
  | {{ label }}
  .editor-tool-label__warn.el-icon-warning(v-if="warn")
</template>

<script>
export default {

  props: ['label', 'headline', 'warn'],

  computed: {

    tag() {
      if (this.headline !== undefined) return 'h3';
      return 'h4';
    },

  },

}
</script>

<style lang="sass">
.editor-tool-label
  margin: 0

  &__warn
    color: var(--warning)
    margin-left: .5em
</style>