<template lang="pug">
transition(name="fade")
  .zero-click-indicator(v-if="show", @click="show = false")
</template>

<script>
export default {

  data() {
    return {
      show: true,
    };
  },

};
</script>

<style lang="sass">
.zero-click-indicator
  position: fixed
  inset: 0

  &:before,
  &:after
    content: ''
    position: absolute
    top: 0
    width: 0px
    height: 0px
    border-style: solid

  &:before
    left: 0
    border-width: 3vw 3vw 0 0
    border-color: #f26522 transparent transparent transparent

  &:after
    right: 0
    border-width: 0 3vw 3vw 0
    border-color: transparent #f26522 transparent transparent

</style>