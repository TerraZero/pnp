<template lang="pug">
.custom-editor-enemy-actions
  .custom-editor-enemy-actions__action(v-for="action, name in type.value.actions")
    .custom-editor-enemy-actions__header
      .custom-editor-enemy-actions__name {{ name }}
      .custom-editor-enemy-actions__bonus {{ action.bonus }}
      .custom-editor-enemy-actions__damage {{ action.damage }}
    .custom-editor-enemy-actions__text {{ action.text }}
</template>

<script>
export default {

  props: ['type'],

}
</script>


<style lang="sass">
.custom-editor-enemy-actions

  &__action + &__action
    border-top: 4px solid white
  
  &__header
    display: grid
    grid-template-columns: 1fr max-content max-content
    border: 2px solid white

  &__name
    padding: 2px 4px
  
  &__text
    border: 2px solid white
    border-top: 0
    padding: 4px 8px

  &__bonus,
  &__damage
    border-left: 6px solid white
    padding: 2px 4px

</style>
      