<template lang="pug">
.temp-image
  .temp-image__frame(:style="frameStyle")
    ElImage.temp-image__image(:src="src", fit="cover", :style="imageStyle")
  .temp-image__frame-overlay(:style="frameStyle")
</template>

<script>
export default {

  props: ['src', 'frame', 'mutate'],

  computed: {

    frameStyle() {
      if (this.frame) {
        return {
          border: this.frame + ' solid #3008',
        };
      }
    },

    imageStyle() {
      const styles = {
        top: (this.mutate?.top ?? 0) + '%',
        left: (this.mutate?.left ?? 0) + '%',
        transform: 'scale(' + (this.mutate?.zoom ?? 1) + ')',
      };

      return styles;
    },

  },

};
</script>

<style lang="sass">
.temp-image
  position: relative
  overflow: hidden
  background: black

  &__frame,
  &__frame-overlay
    position: absolute
    top: 0
    left: 0
    width: 100%
    height: 100%
    box-sizing: border-box
    
  &__image
    position: absolute
    top: 0
    left: 0
    width: 100%
    height: 100%
</style>