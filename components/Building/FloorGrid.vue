<template lang="pug">
.building-floor-grid(ref="frame", @wheel="onWheel", @mousedown="onMouseDown", @mouseup="onMouseUp", v-zero:debounce:wheel="saveConfig")
  .building-floor-grid__grid(:style="styles")
    BuildingEditorTile.building-floor-grid__item(v-for="item in grid", :key="item.id", :tile="item", @select="onSelect(item)")
</template>

<script>
export default {

  inject: {
    editor: { default: null },
    ws: { default: null },
  },

  async mounted() {
    const config = await this.editor.getConfig('floor', this.editor.floor, 'grid', {});
    this.x = config.x ?? this.x;
    this.y = config.y ?? this.y;
    this.size = config.size ?? this.size;
  },

  data() {
    return {
      x: 50,
      y: 50,
      dragX: null,
      dragY: null,
      ox: 0,
      oy: 0,
      size: 50,
    };
  },

  computed: {

    grid() {
      return this.editor.grid?.sort((a, b) => {
        if (a.x === 0 && a.y === 0) return -1;
        if (b.x === 0 && b.y === 0) return 1;
        if (a.x === b.x) a.y - b.y;
        return a.x - b.x;
      }) ?? [];
    },

    styles() {
      const styles = {};

      styles.top = `${this.y + this.oy}px`;
      styles.left = `${this.x + this.ox}px`;
      styles['grid-template-columns'] = `repeat(${this.editor.floor.width}, ${this.size}px)`;
      styles['grid-template-rows'] = `repeat(${this.editor.floor.height}, ${this.size}px)`;
      styles.gap = `${this.editor.gap}px`;
      return styles;
    },

  },

  methods: {

    onSelect(tile) {
      this.$emit('tileselect', tile);
    },

    onWheel(e) {
      this.size += (e.deltaY > 0 ? 10 : -10);
    },

    onMouseDown(e) {
      if (e.button === 1) {
        this.dragX = e.clientX;
        this.dragY = e.clientY;
        this.$refs.frame.addEventListener('mousemove', this.onMouseMove);
      }
    },

    onMouseMove(e) {
      if (this.dragX !== null) {
        this.ox = e.clientX - this.dragX;
        this.oy = e.clientY - this.dragY;
      }
    },

    onMouseUp(e) {
      if (e.button === 1) {
        this.x += this.ox;
        this.y += this.oy;
        this.ox = 0;
        this.oy = 0;
        this.dragX = null;
        this.dragY = null;
        this.$refs.frame.removeEventListener('mousemove', this.onMouseMove);
        this.saveConfig();
      }
    },

    saveConfig() {
      this.editor.setConfig('floor', this.editor.floor, 'grid', {
        x: this.x,
        y: this.y,
        size: this.size,
      });
    },

    async doReset() {
      this.x = 50;
      this.y = 50;
      this.size = 50;
    },

  },

}
</script>


<style lang="sass">
.building-floor-grid
  width: 100%
  height: 100%
  position: relative
  overflow: hidden

  &__grid
    position: absolute
    display: grid

</style>
        