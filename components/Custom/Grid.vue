<template lang="pug">
.custom-grid
  .custom-grid__floor(:style="styles")
    .custom-grid__item(v-for="i in width * height", :key="i")
  .custom-grid__floor.custom-grid__floor-2(:style="styles")
    .custom-grid__item(v-for="i in width * height", :key="i")
  .custom-grid__floor.custom-grid__floor-3(:style="styles")
    .custom-grid__item(v-for="i in width * height", :key="i")
</template>

<script>
export default {

  data() {
    return {
      width: 10,
      height: 10,
    };
  },

  computed: {

    styles() {
      return {
        'grid-template-columns': '1fr '.repeat(this.width),
        'width': (this.width * 100) + 'px',
      };
    },

  },

}
</script>


<style lang="sass">
body
  margin: 0

.custom-grid
  position: relative
  width: 1000px
  height: 1000px
  transform: scaleY(.7) rotate(70deg)
  transform-style: preserve-3d

  &__floor
    display: grid
    background: rgba(0, 0, 0, .5)
    position: absolute
    top: 0
    left: 0

  &__floor-2
    transform: translate(-100px, -100px)

  &__item
    border: 1px solid white
    width: 100px
    height: 100px
    box-sizing: border-box

</style>
  