<template lang="pug">
.layout-grid(:class="classes")
  .layout-grid__label(v-if="label") {{ label }}
  .layout-grid__items(:style="styles")
    slot(v-for="slotName in items", :name="slotName")
</template>

<script>
export default {

  props: ['layout'],

  computed: {

    classes() {
      const classes = [];

      if (this.label) classes.push('fieldset');
      return classes.map(v => 'layout-grid--' + v);
    },

    items() {
      const items = [];

      for (const index in this.$slots) {
        items.push(index);
      }
      for (const index in this.$scopedSlots) {
        if (items.indexOf(index) === -1) items.push(index);
      }
      return items;
    },

    styles() {
      const styles = {};

      if (this.layout) {
        if (typeof this.layout.columns === 'number') {
          styles['grid-template-columns'] = '1fr '.repeat(this.layout.columns);
        } else if (typeof this.layout.columns === 'string') {
          styles['grid-template-columns'] = this.layout.columns;
        }

        if (this.layout.gap) {
          styles.gap = this.layout.gap;
        }
        
        if (typeof this.layout.styles === 'function') {
          this.layout.styles({ styles, layout: this });
        }
      }
      return styles;
    },

    label() {
      return this.layout?.fieldset;
    },

  },

}
</script>

<style lang="sass">
.layout-grid
  display: grid

  &__items
    display: grid
    background: var(--color--background)

  &--fieldset
    box-shadow: var(--shadow--ui)

  &--fieldset &__label
    font-size: 1.5em
    padding: .7em .7em .5em
    background: var(--background--highlight)
    color: var(--color--font-main)

  &--fieldset &__items
    padding: 1em
    border: 2px solid var(--color--background)
    border-top: 0

</style>