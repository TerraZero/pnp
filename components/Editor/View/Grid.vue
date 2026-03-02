<template lang="pug">
.editor-view-grid(:class="classes")
  .editor-view-grid__wrapper(:style="wrapperStyle")
    slot
    .editor-view-grid__overlay(:style="overlayStyles")
      .editor-view-grid__top
      .editor-view-grid__left
      .editor-view-grid__right
      .editor-view-grid__bottom
      .editor-view-grid__grid
        .editor-view-grid__item(v-for="index, item in config.grid.x * config.grid.y", :key="index", :class="getItemClass({ index, point: getPoint(config.grid.x, item) })", @click="$emit('click-item', { index, point: getPoint(config.grid.x, item) })", @mouseover="$emit('hover-item', { index, point: getPoint(config.grid.x, item) })")
          .editor-view-grid__point(v-if="mode === 'editor'")
            | {{ getPoint(config.grid.x, item).x }} / {{ getPoint(config.grid.x, item).y }}
</template>

<script>
const RemoteSystem = require('zero-system/src/RemoteSystem');

/** @type {import('~/custom/server/map/Remote/Map.remote')} */
let _mapRemote = null;

export default {

  props: ['config', 'rooms', 'active', 'mode', 'select', 'control', 'size'],

  beforeCreate() {
    _mapRemote ??= RemoteSystem.getSync('remote.map');
  },

  computed: {

    classes() {
      const classes = [];

      if (this.mode) classes.push('mode-' + this.mode);
      if (this.control) classes.push('control');
      if (this.size) classes.push('size');
      return classes.map(v => 'editor-view-grid--' + v);
    },

    overlayStyles() {
      return {
        '--editor-view-grid--x': this.config.grid.x,
        '--editor-view-grid--y': this.config.grid.y,
        '--editor-view-grid--offset-left': this.config.offset.left + '%',
        '--editor-view-grid--offset-top': this.config.offset.top + '%',
        '--editor-view-grid--offset-right': this.config.offset.right + '%',
        '--editor-view-grid--offset-bottom': this.config.offset.bottom + '%',
      };
    },

    wrapperStyle() {
      const styles = {};

      if (this.size) {
        styles.width = this.size.width + 'px';
        styles.height = this.size.height + 'px';
      }
      return styles;
    },

  },

  methods: {

    getPoint(width, index) {
      return { x: index % width + 1, y: Math.floor(index / width) + 1 };
    },

    getItemClass({ point }) {
      const classes = [];

      if (this.mode === 'editor') {
        let borders = [];
        if (this.active !== null && this.active !== undefined) borders = _mapRemote.getBorderArray(this.rooms[this.active].items);
        for (const index in this.rooms) {
          const item = _mapRemote.find(this.rooms[index].items, point);
          if (item !== null) {
            if (this.control && this.control?.value?.rooms[index]?.show) {
              classes.push('show');
            }

            if (index == this.active) {
              const border = _mapRemote.find(borders, item);
              if (border) {
                if (border.border.top) classes.push('border-top');
                if (border.border.left) classes.push('border-left');
                if (border.border.right) classes.push('border-right');
                if (border.border.bottom) classes.push('border-bottom');
              }
            }
            classes.push('room');
            break;
          }
        }

        if (this.select && _mapRemote.inRect(this.select, point)) {
          classes.push('select');
        }
      } else if (this.mode === 'screen') {
        for (const index in this.rooms) {
          const item = _mapRemote.find(this.rooms[index].items, point);
          if (item !== null) {
            if (this.control && this.control.value.rooms[index].show) {
              classes.push('show');
            }
            break;
          }
        }
      }

      return classes.map(v => 'editor-view-grid__item--' + v);
    },

  },

}
</script>

<style lang="sass">
.editor-view-grid
  --editor-view-grid--border-width: 3px

  &--size
    display: flex
    justify-content: center
    align-items: center
    width: 100%
    height: 100%
  
  &__wrapper
    position: relative
    display: inline-flex

  &__grid
    position: absolute
    top: var(--editor-view-grid--offset-top, 0)
    left: var(--editor-view-grid--offset-left, 0)
    right: var(--editor-view-grid--offset-right, 0)
    bottom: var(--editor-view-grid--offset-bottom, 0)
    display: grid
    grid-template-columns: repeat(var(--editor-view-grid--x), 1fr)
    grid-template-rows: repeat(var(--editor-view-grid--y), 1fr)

  &__item
    border: 1px solid black
    position: relative
    cursor: pointer

  &__item--room
    background: rgba(0, 0, 0, .3)
    position: relative

  &--control &__item--room
    background: rgba(0, 0, 0, .6)

  &--mode-screen &__item
    background: black
    transition: background .3s

  &__item--room:after
    content: ''
    position: absolute
    top: 0
    left: 0
    right: 0
    bottom: 0
    pointer-events: none
    box-sizing: border-box
    z-index: 10

  &__item--border-top:after
    border-top: var(--editor-view-grid--border-width, 3px) solid #00bdb5
    top: calc(var(--editor-view-grid--border-width, 3px) * -1)

  &__item--border-left:after
    border-left: var(--editor-view-grid--border-width, 3px) solid #00bdb5
    left: calc(var(--editor-view-grid--border-width, 3px) * -1)

  &__item--border-right:after
    border-right: var(--editor-view-grid--border-width, 3px) solid #00bdb5
    right: calc(var(--editor-view-grid--border-width, 3px) * -1)

  &__item--border-bottom:after
    border-bottom: var(--editor-view-grid--border-width, 3px) solid #00bdb5
    bottom: calc(var(--editor-view-grid--border-width, 3px) * -1)

  &__item--select
    background: #00bdb5A0

  &--control &__item--show,
  &--mode-screen &__item--show
    background: transparent

  &__point
    position: absolute
    top: 0
    left: 0
    padding: .2em
    background: #00bdb5
    opacity: 0
    transition: opacity .15s ease-in-out

  &__item:hover &__point
    opacity: 1

  &__top,
  &__left,
  &__right,
  &__bottom
    position: absolute
    background: rgba(255, 0, 0, .5)
    top: 0
    left: 0
    right: 0
    bottom: 0

  &--mode-screen &__top,
  &--mode-screen &__left,
  &--mode-screen &__right,
  &--mode-screen &__bottom
    background: black

  &__top
    height: var(--editor-view-grid--offset-top, 0)
    bottom: initial

  &__left
    width: var(--editor-view-grid--offset-left, 0)
    right: initial

  &__right
    width: var(--editor-view-grid--offset-right, 0)
    left: initial

  &__bottom
    height: var(--editor-view-grid--offset-bottom, 0)
    top: initial

</style>