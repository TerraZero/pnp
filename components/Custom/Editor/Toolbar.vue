<template lang="pug">
.custom-editor-toolbar
  .custom-editor-toolbar__item(v-for="item in items", :key="item.id", :class="getItemClass(item)", @click="onClick(item)")
    span.custom-editor-toolbar__icon(:class="'el-icon-' + item.icon")
</template>

<script>
export default {

  props: ['items'],

  methods: {

    getItemClass(item) {
      const classes = [];

      if (item.active) classes.push('active');
      if (item.classes) classes.push(...item.classes);
      return classes.map(v => 'custom-editor-toolbar__item--' + v);
    },

    onClick(item) {
      this.$emit('tool', item);
    },

  },

}
</script>


<style lang="sass">
.custom-editor-toolbar
  display: inline-flex
  height: 100%
  gap: .3em

  &__item
    padding: .2em
    height: 100%
    box-sizing: border-box
    aspect-ratio: 1
    display: flex
    justify-content: center
    align-items: center
    cursor: pointer
    background: var(--land)
    transition: background .2s ease-in-out
  
  &__item:hover,
  &__item--active
    background: var(--secondary)

</style>
    