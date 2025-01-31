<template lang="pug">
.layout-grid(:style="styles")
  .layout-grid__item(v-for="(_, slotName) in $slots")
    slot(:name="slotName")
  .layout-grid__item(v-for="(_, slotName) in $scopedSlots")
    slot(:name="slotName")
</template>

<script>
export default {

  props: ['layout'],

  computed: {

    styles() {
      const styles = {};

      if (this.layout) {
        if (this.layout.columns) {
          styles['grid-template-columns'] = '1fr '.repeat(this.layout.columns);
        }
        
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
.layout-grid
  display: grid
</style>