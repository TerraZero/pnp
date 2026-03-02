<template lang="pug">
.custom-editor-enemy-skills
  .custom-editor-enemy-skills__wrapper(v-if="type.value.skills")
    .custom-editor-enemy-skills__skill(v-for="value, name in type.value.skills")
      .custom-editor-enemy-skills__label {{ name }}
      .custom-editor-enemy-skills__value {{ value }}
  .custom-editor-enemy-skills__list(v-if="type.value.resistances")
    .custom-editor-enemy-skills__headline Resistenz
    .custom-editor-enemy-skills__items
      .custom-editor-enemy-skills__item(v-for="value in type.value.resistances") {{ value }}
  .custom-editor-enemy-skills__list(v-if="type.value.immunities")
    .custom-editor-enemy-skills__headline Immunität
    .custom-editor-enemy-skills__items
      .custom-editor-enemy-skills__item(v-for="value in type.value.immunities") {{ value }}
  .custom-editor-enemy-skills__list(v-if="type.value.vulnerabilities")
    .custom-editor-enemy-skills__headline Schwächen
    .custom-editor-enemy-skills__items
      .custom-editor-enemy-skills__item(v-for="value in type.value.vulnerabilities") {{ value }}
    
</template>

<script>
export default {

  props: ['type'],

}
</script>


<style lang="sass">
.custom-editor-enemy-skills

  &__wrapper
    display: grid
    grid-template-columns: repeat(4, 1fr)

  &__skill
    display: grid
    grid-template-columns: min-content 1fr
    border: 2px solid white

  &__label,
  &__value,
  &__item,
  &__headline
    padding: .2em .4em

  &__label
    border-right: 2px solid white

  &__item
    display: inline-block
    border: 2px solid white

  &__headline
    text-align: center
    text-transform: uppercase
    font-size: 1.2em
    border: 2px solid white
    background: #212121

</style>
      