<template lang="pug">
.temp-breadcrumb-state(:class="classes")
  span(:class="iconClasses")
</template>

<script>
export default {

  props: ['icon', 'status'],

  computed: {

    classes() {
      const classes = [];

      if (this.status) classes.push('temp-breadcrumb-state--status-' + this.status);
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

};
</script>

<style lang="sass">
.temp-breadcrumb-state
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

</style>