<template lang="pug">
.custom-editor-actions
  .custom-editor-actions__item(v-for="item in items", :key="item.id", :class="getItemClass(item)", @click="onClick(item)")
    | {{ item.label }}
    span.custom-editor-actions__icon(:class="'el-icon-' + item.icon")
</template>

<script>
export default {

  props: ['items'],

  methods: {

    getItemClass(item) {
      const classes = [];

      if (item.active) classes.push('active');
      if (item.classes) classes.push(...item.classes);
      return classes.map(v => 'custom-editor-actions__item--' + v);
    },

    onClick(item) {
      this.$emit('action', item);
    },

  },

}
</script>


<style lang="sass">
.custom-editor-actions
  display: flex
  height: 100%
  gap: .5em
  background: var(--secondary)
  padding: 0 .5em

  &__item
    display: inline-flex
    gap: .3em
    padding: .5em 1em
    font-size: 1.2em
    color: var(--pen)
    height: 100%
    box-sizing: border-box
    display: flex
    justify-content: center
    align-items: center
    cursor: pointer
    background: var(--land)
    transition: background .2s ease-in-out
    border: 3px solid var(--land)
  
  &__item:hover,
  &__item--active
    background: var(--secondary)

</style>
      