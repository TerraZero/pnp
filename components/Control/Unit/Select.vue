<template lang="pug">
.control-unit-select
  .control-unit-select__items
    .control-unit-select__item(@click="onCreateUnit")
      .control-unit-select__icon
        span.el-icon-plus
      .control-unit-select__text
        | Create Unit
    .control-unit-select__item(v-for="item in units", :key="item.id", @click="onSelect(item)")
      CustomPluginUnitDisplay(:unit="item", display="default", overflow)
      .control-unit-select__text
        | {{ item.label }}
</template>

<script>
import RemoteSystem from 'zero-system/src/RemoteSystem';

/** @type {import('~/custom/server/enemy/Entity/UnitType.entity')} */
let _unitTypeStorage = null;
/** @type {import('~/custom/server/enemy/Entity/Unit.entity')} */
let _unitStorage = null;

export default {

  inject: ['zui', 'zuiw'],

  async created() {
    _unitStorage = await RemoteSystem.get('entity.unit');
    _unitTypeStorage = await RemoteSystem.get('entity.unit_type');
    await this.update();
  },

  data() {
    return {
      search: '',
      pager: null,
      units: [],
    };
  },

  methods: {

    async update() {
      const result = await _unitStorage.search(this.search);
      this.units = result.items;
      this.pager = result.pager;
    },

    onSelect(unit) {
      this.zuiw.close({ unit });
    },

    async onCreateUnit() {
      const window = await this.zui.open('/entity/unit');
      window.addEvent('close', () => {
        setTimeout(() => {
          this.update();
        }, 50);
      });
    },

  },

}
</script>

<style lang="sass">
.control-unit-select

  &__items
    display: grid
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr))
    gap: .5em
    padding: .5em
    height: var(--zui-window--height-real)
    box-sizing: border-box
    
  &__item
    display: flex
    justify-content: center
    align-items: center
    background: #212121
    padding: .5em
    flex-direction: column
    min-height: 30%
    font-size: 2em
    transition: background .2s ease-in-out
    cursor: pointer

    &:hover
      background: #313131
  
  &__icon
    padding-bottom: 1em
    font-size: 2em


</style>