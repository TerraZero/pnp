<template lang="pug">
.building-editor-tile
  .building-editor-tile__info(@click="onInfo")
    | {{ tile.x }} / {{ tile.y }}
    span(class="el-icon-edit")
  BuildingTile.building-editor-tile__tile(:tile="tile", @click.native="onClick")
</template>

<script>
const RemoteSystem = require('zero-system/src/RemoteSystem');

export default {

  props: ['tile'],

  methods: {

    async onInfo() {
      /** @type {import('~/custom/server/form/Remote/Form.remote')} */
      const forms = await RemoteSystem.get('remote.form');

      forms.open('form.generate.edit', { generate: 'entity.tile', id: this.tile.id });
    },

    onClick() {
      this.$emit('select', this.tile);
    },

  },

}
</script>


<style lang="sass">
.building-editor-tile
  display: inline-block
  position: relative
  cursor: pointer

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

  &__tile
    background: repeating-linear-gradient(45deg, #2F3E6730, #2F3E6730 10px, transparent 10px, transparent 20px)
</style>
          