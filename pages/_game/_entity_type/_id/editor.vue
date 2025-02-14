<template lang="pug">
.page-editor(:class="classes")
  .page-editor__topbar
    .page-editor__left
      .page-editor__title {{ building.name }}
    .page-editor__right
      .page-editor__button(@click="onSidebarOpen")
        span.el-icon-s-fold()
  .page-editor__wrapper
    .page-editor__content
    .page-editor__sidebar
      ElTabs(v-model="tab", type="card", lazy)
        ElTabPane(name="building", label="Building")
          BuildingForm
        ElTabPane(name="floor", label="Floor")
          BuildingFloorForm
</template>

<script>
const RemoteSystem = require('zero-system/src/RemoteSystem');

/** @type {import('~/custom/server/building/Entity/Building.entity')} */
let buildingStorage = null;

export default {

  async asyncData({ params }) {
    const data = { params };
    buildingStorage = await RemoteSystem.get('entity.building');
    data.building = await buildingStorage.load(params.id, true);
    return data;
  },

  provide() {
    return {
      editor: this,
    };
  },

  data() {
    return {
      tab: 'building',
      open: false,
      floor: null,
    };
  },

  computed: {

    classes() {
      const classes = [];

      if (this.open) classes.push('open');
      return 'page-editor--' + classes.join(' page-editor--');
    },

  },

  methods: {

    onSidebarOpen() {
      this.open = !this.open;
    },

  },

}
</script>

<style lang="sass">
.page-editor
  width: 100vw
  height: 100vh
  position: relative
  overflow: hidden
  display: grid
  grid-template-rows: 35px 1fr

  &__topbar
    background: grey
    display: flex
    justify-content: space-between

  &__title
    display: flex
    align-items: center
    height: 100%
    margin-left: 1em

  &__wrapper
    position: relative

  &__content
    width: 100%
    height: 100%

  &__sidebar
    position: absolute
    top: 0
    right: 0
    width: 50%
    max-width: 700px
    height: 100%
    overflow: hidden
    transition: transform .2s ease-in-out
    border-left: 2px solid black
    box-sizing: border-box
    transform: translateX(100%)
    background: #AAA

  &--open &__sidebar
    transform: translateX(0)

  &__button
    padding: 0 .5em
    display: flex
    align-items: center
    height: 100%
    box-sizing: border-box
    border-left: 1px solid black
    cursor: pointer

</style>