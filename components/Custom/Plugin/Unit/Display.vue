<template lang="pug">
.custom-plugin-unit-display(:class="classes", @click.middle="onClick", v-loading="loading")
  .custom-plugin-unit-display__scaler(v-if="type && entity", :style="scalerStyles")
    ElImage.custom-plugin-unit-display__image(:src="image", :style="imageStyles")
</template>

<script>
import RemoteSystem from 'zero-system/src/RemoteSystem';

/** @type {import('~/custom/server/enemy/Entity/Unit.entity')} */
let _unitStorage = null;
/** @type {import('~/custom/server/enemy/Entity/UnitType.entity')} */
let _unitTypeStorage = null;

export default {

  inject: ['zui'],

  props: ['unit', 'display', 'overflow'],

  watch: {

    unit: {
      handler(value) {
        this.setUnit(value);
      },
      immediate: true,
    },

  },

  created() {
    this.prepare();
  },

  data() {
    return {
      loading: true,
      entity: null,
      type: null,
      outline: false,
    };
  },

  computed: {

    classes() {
      const classes = [];

      if (this.type && this.current.props?.mirror) classes.push('mirror');
      if (this.outline) classes.push('outline');
      if (!this.showOverflow) classes.push('overflow');
      return classes.map(v => 'custom-plugin-unit-display--' + v);
    },

    showOverflow() {
      return this.overflow !== '' || this.outline;
    },

    current() {
      return this.type?.value.displays[this.display];
    },

    image() {
      return '/eldritch' + this.current?.img;
    },

    scalerStyles() {
      const styles = {};

      styles.top = (this.current.top / 10) + 'vh';
      styles.left = (this.current.left / 10) + 'vw';
      return styles;
    },

    imageStyles() {
      const styles = {};

      styles.width = (this.current.width / 10) + 'vw';
      return styles;
    },

  },

  methods: {

    async prepare() {
      _unitTypeStorage ??= await RemoteSystem.get('entity.unit_type');
      _unitStorage ??= await RemoteSystem.get('entity.unit');
    },

    async setUnit(unit) {
      await this.prepare();
      this.loading = true;
      if (typeof unit === 'number') {
        this.entity = await _unitStorage.load(unit);
      } else {
        this.entity = unit;
      }
      this.type = await _unitTypeStorage.load(this.entity.type);
      this.loading = false;
    },

    async onClick() {
      this.outline = true;
      const window = await this.zui.inlineEntity('unit_type', 'displays', { entity: this.type });
      window.addEvent('close', async () => {
        _unitTypeStorage.save(this.type);
        this.outline = false;
      });
    },

  },

}
</script>

<style lang="sass">
.custom-plugin-unit-display
  display: flex
  justify-content: center
  align-items: center
  width: 10vw
  height: 10vw
  position: relative

  &--overflow
    overflow: hidden

  &--outline
    outline: 2px solid red

  &__scaler
    position: relative

  &__image
    width: 100%
    height: auto

  &--mirror &__image
    transform: rotateY(180deg)

</style>