<template lang="pug">
.zero-accordion(:style="styles")
  slot
</template>

<script>
export default {

  props: ['value'],

  provide() {
    return {
      accordion: this,
    };
  },

  watch: {

    value() {
      this.update();
    },

  },

  data() {
    return {
      items: [],
    };
  },

  computed: {

    styles() {
      const styles = {};

      const rows = [];
      for (const item of this.items) {
        if (item.name === this.value) {
          rows.push('1fr');
        } else {
          rows.push('min-content');
        }
      }
      styles['grid-template-rows'] = rows.join(' ');
      return styles;
    },

  },

  methods: {

    add(item) {
      this.items.push(item);
      this.update();
    },

    setActive(id) {
      this.$emit('input', id);
    },

    update() {
      for (const item of this.items) {
        item.onActive(item.name === this.value);
      }
    },

  },

};
</script>

<style lang="sass">
.zero-accordion
  display: grid
</style>