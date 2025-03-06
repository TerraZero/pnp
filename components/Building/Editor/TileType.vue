<template lang="pug">
.building-editor-tile-type
  BuildingTileLayer.building-editor-tile-type__layer(:layer="layer")
  .building-editor-tile-type__label
    | {{ layer.key }} / {{ layer.label }}
</template>

<script>
export default {

  props: ['layer'],

}
</script>


<style lang="sass">
.building-editor-tile-type
  display: inline-block

  &__layer
    width: 100px
    height: 100px

  &__label
    margin-top: 4px

</style>
            