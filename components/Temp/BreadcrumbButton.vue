<template lang="pug">
.temp-breadcrumb-button(:class="classes", @click="onClick")
  span(v-if="icon", :class="iconClasses")
  span.temp-breadcrumb-button__custom(v-else) 
    slot
</template>

<script>
export default {

  props: ['icon', 'to', 'status', 'unicode'],

  computed: {

    classes() {
      const classes = [];

      if (this.status) classes.push('temp-breadcrumb-button--status-' + this.status);
      if (this.unicode !== undefined) classes.push('temp-breadcrumb-button--unicode');
      return classes;
    },

    iconClasses() {
      const classes = [];

      if (this.icon) {
        classes.push('el-icon-' + this.icon);
      }
      return classes;
    },

  },

  methods: {

    onClick() {
      if (this.to) {
        this.$router.push(this.to);
      } else {
        this.$emit('click', this);
      }
    },

  },

};
</script>

<style lang="sass">
.temp-breadcrumb-button
  display: flex
  justify-content: center
  align-items: center
  width: 28px
  height: 28px
  box-sizing: border-box
  cursor: pointer
  background: var(--color--highlight-second)

  &--status-success
    background: var(--success-status)

  &--status-warning
    background: var(--warning-status)

  &--status-error
    background: var(--error-status)

  &:hover
    background: var(--color--highlight-second-light)

  &--unicode &__custom
    filter: brightness(0) invert(1)
    
</style>