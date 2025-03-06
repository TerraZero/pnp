<template lang="pug">
.building-tile-layer(:style="styles")
</template>

<script>
export default {

  props: ['layer'],

  computed: {

    styles() {
      const styles = {};
      
      if (this.layer.bg) {
        styles.background = this.layer.bg;
      }
      if (this.selected) {
        styles.border = '1px solid red';
      }
      return styles;
    },

  },

  methods: {

  },

}
</script>


<style lang="sass">
.building-tile-layer
  width: 100%
  height: 100%

</style>
            