<template lang="pug">
.custom-plugin-unit-hero-view(:class="classes", @click.middle="onClick")
  .custom-plugin-unit-hero-view__scaler(:style="scalerStyles")
    ElImage.custom-plugin-unit-hero-view__image(v-if="value.img", :src="value.img", :style="imageStyles")
</template>

<script>
export default {

  inject: ['zui'],

  props: ['value', 'avatar'],

  computed: {

    classes() {
      const classes = [];

      if (this.display.props?.mirror) classes.push('mirror');
      return classes.map(v => 'custom-plugin-unit-hero-view--' + v);
    },

    display() {
      if (this.avatar !== undefined) {
        return this.value.displays.avatar;
      } else {
        return this.value.displays.default;
      }
    },

    scalerStyles() {
      const styles = {};

      styles.top = (this.display.top / 10) + 'vh';
      styles.left = (this.display.left / 10) + 'vw';
      return styles;
    },

    imageStyles() {
      const styles = {};

      styles.width = (this.display.width / 10) + 'vw';
      return styles;
    },

  },

  methods: {

    onClick() {
      console.log(this.value);
      return;
      const window = this.zui.inline({
        component: 'Entity/ZUI/UnitType/Display',
        params: {
          entity: this.value,
          display: 'avatar',
        },
        frame: {
          title: 'Edit avatar "' + this.value.label + '"',
        },
      });
      window.addEvent('close', async event => {
        console.log(event);
      });
    },

  },

}
</script>

<style lang="sass">
.custom-plugin-unit-hero-view
  display: flex
  justify-content: center
  align-items: center
  width: 10vw
  height: 10vw

  &__scaler
    position: relative

  &__image
    width: 100%
    height: auto

  &--mirror &__image
    transform: rotateY(180deg)
  
</style>