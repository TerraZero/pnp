<template lang="pug">
.zero-accordion-item(:class="classes")
  .zero-accordion-item__label(@click="onClick")
    slot(name="label")
      | {{ label }}
  .zero-accordion-item__content(v-if="active")
    slot
</template>

<script>
export default {

  props: ['label', 'name'],

  inject: ['accordion'],

  mounted() {
    this.accordion.add(this);
  },

  data() {
    return {
      active: false,
    };
  },

  computed: {

    classes() {
      const classes = [];

      if (this.active) classes.push('active');
      return classes.map(v => 'zero-accordion-item--' + v);
    },

  },

  methods: {

    onActive(active) {
      this.active = active;
    },

    onClick() {
      this.accordion.setActive(this.name);
    },

  },

};
</script>

<style lang="sass">
.zero-accordion-item
  color: var(--pen)

  &--active
    display: grid
    grid-template-rows: min-content 1fr

  &__label
    cursor: pointer
    background: var(--zero-accordion-color-label, #d0d3d9)
    border: 1px solid var(--zero-accordion-color-border, var(--border))
    padding: 2px .8em
    color: var(--zero-accordion-pen)
    transition: background .3s ease-in-out, color .3s ease-in-out

  &__label:hover,
  &--active &__label
    color: var(--zero-accordion-pen-active)
    background: var(--zero-accordion-color-active)

  &__content
    color: var(--zero-accordion-pen-content)
    background: var(--zero-accordion-color-content)
</style>
  