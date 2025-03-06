<template lang="pug">
.building-tile
  BuildingTileLayer.building-tile__layer(v-for="layer, index in layers", :key="index", :tile="tile", :layer="layer")
</template>

<script>
export default {

  props: ['tile'],

  data() {
    return {
      
    };
  },

  computed: {

    layers() {
      return this.tile.value.layers ?? [];
    },

  },

}
</script>


<style lang="sass">
.building-tile
  display: inline-block
  background: grey
  position: relative
  cursor: pointer
  width: 100%
  height: 100%

  &__info
    padding: .2em .8em
    position: absolute
    bottom: 100%
    right: 0
    color: var(--pen-contrast)
    background: var(--editor-high-light)
    display: none
    gap: .5em

  &:hover &__info
    display: flex

  &__layer
    position: absolute
    top: 0
    left: 0
    width: 100%
    height: 100%

</style>
            