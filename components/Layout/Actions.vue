<template lang="pug">
.layout-actions(:style="styles")
  slot(name="default")
</template>

<script>
export default {

  props: ['layout'],

  computed: {

    styles() {
      const styles = {};

      if (this.layout) {
        if (typeof this.layout.styles === 'function') {
          this.layout.styles({ styles, layout: this });
        }
      }
      return styles;
    },

  },

}
</script>

<style lang="sass">
.layout-actions
  display: flex
  gap: .5em

  & > *
    flex: none

</style>