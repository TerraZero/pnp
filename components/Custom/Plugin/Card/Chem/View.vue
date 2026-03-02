<template lang="pug">
.custom-plugin-card-chem-view(:class="classes")
  .custom-plugin-card-chem-view__content
    .custom-plugin-card-chem-view__header
      .custom-plugin-card-chem-view__label {{ config.label }}
      .custom-plugin-card-chem-view__type
        CustomCardViewText(:text="type")
    .custom-plugin-card-chem-view__text
      CustomCardViewText(:text="config.text")
  .custom-plugin-card-chem-view__top
  .custom-plugin-card-chem-view__left
  .custom-plugin-card-chem-view__right
  .custom-plugin-card-chem-view__bottom
</template>

<script>
export default {

  props: ['config'],

  computed: {

    classes() {
      const classes = [];

      classes.push('top-' + this.config.top);
      classes.push('left-' + this.config.left);
      classes.push('right-' + this.config.right);
      classes.push('bottom-' + this.config.bottom);
      return classes.map(v => 'custom-plugin-card-chem-view--' + v);
    },

    type() {
      return '{' + this.config.type.toUpperCase() + '}';
    },

  },

}
</script>

<style lang="sass">
.custom-plugin-card-chem-view
  position: relative
  width: 100%
  height: 100%
  background: white
  box-shadow: 0 0 16px black
  --custom-plugin-card-chem-view--size: 1em
  --custom-plugin-card-chem-view--color: black
  --custom-plugin-card-chem-view--top-width: 0 var(--custom-plugin-card-chem-view--size) var(--custom-plugin-card-chem-view--size) var(--custom-plugin-card-chem-view--size)
  --custom-plugin-card-chem-view--left-width: var(--custom-plugin-card-chem-view--size) var(--custom-plugin-card-chem-view--size) var(--custom-plugin-card-chem-view--size) 0
  --custom-plugin-card-chem-view--right-width: var(--custom-plugin-card-chem-view--size) 0 var(--custom-plugin-card-chem-view--size) var(--custom-plugin-card-chem-view--size)
  --custom-plugin-card-chem-view--bottom-width: var(--custom-plugin-card-chem-view--size) var(--custom-plugin-card-chem-view--size) 0 var(--custom-plugin-card-chem-view--size)
  --custom-plugin-card-chem-view--top-color: transparent transparent var(--custom-plugin-card-chem-view--color) transparent
  --custom-plugin-card-chem-view--left-color: transparent var(--custom-plugin-card-chem-view--color) transparent transparent
  --custom-plugin-card-chem-view--right-color: transparent transparent transparent var(--custom-plugin-card-chem-view--color)
  --custom-plugin-card-chem-view--bottom-color: var(--custom-plugin-card-chem-view--color) transparent transparent transparent


  &__header
    position: relative
    padding: 1em
    padding-bottom: 0

  &__type
    position: absolute
    width: 2em
    height: 2em
    display: flex
    justify-content: center
    align-items: center
    top: 1em
    left: 1em
    z-index: 1

  &__type:before
    content: ''
    position: absolute
    top: 0
    left: 0
    right: 0
    bottom: 0
    border: 2px solid black
    box-sizing: border-box
    transform: rotate(45deg)
    background: white
    z-index: -1

  &__label
    display: flex
    align-items: center
    box-sizing: border-box
    margin-left: .7em
    border: 2px solid black
    height: 2em
    padding-left: 1.8em
    position: relative

  &__label:after
    content: ''
    width: 20px
    height: 20px
    border-top: 2px solid black
    border-left: 2px solid black
    background: white
    position: absolute
    top: 3px
    right: -12px
    transform: rotate(-45deg)

  &__text
    padding: .5em 1em
    height: 167px
    font-size: .97em

  &__content
    padding: .5em
    position: relative

  &__top,
  &__left,
  &__right,
  &__bottom
    position: absolute
    width: 0px
    height: 0px
    border-style: solid

  &__top
    border-width: var(--custom-plugin-card-chem-view--top-width)
    border-color: var(--custom-plugin-card-chem-view--top-color)
    top: 0
    left: calc(50% - var(--custom-plugin-card-chem-view--size))

  &--top-input &__top
    border-width: var(--custom-plugin-card-chem-view--bottom-width)
    border-color: var(--custom-plugin-card-chem-view--bottom-color)
  
  &__left
    border-width: var(--custom-plugin-card-chem-view--left-width)
    border-color: var(--custom-plugin-card-chem-view--left-color)
    top: calc(50% - var(--custom-plugin-card-chem-view--size))
    left: 0

  &--left-input &__left
    border-width: var(--custom-plugin-card-chem-view--right-width)
    border-color: var(--custom-plugin-card-chem-view--right-color)

  &__right
    border-width: var(--custom-plugin-card-chem-view--right-width)
    border-color: var(--custom-plugin-card-chem-view--right-color)
    top: calc(50% - var(--custom-plugin-card-chem-view--size))
    right: 0

  &--right-input &__right 
    border-width: var(--custom-plugin-card-chem-view--left-width)
    border-color: var(--custom-plugin-card-chem-view--left-color)

  &__bottom
    border-width: var(--custom-plugin-card-chem-view--bottom-width)
    border-color: var(--custom-plugin-card-chem-view--bottom-color)
    bottom: 0
    left: calc(50% - var(--custom-plugin-card-chem-view--size))

  &--bottom-input &__bottom
    border-width: var(--custom-plugin-card-chem-view--top-width)
    border-color: var(--custom-plugin-card-chem-view--top-color)

</style>