<template lang="pug">
.temp-breadcrumb(:class="classes")
  ElBreadcrumb.temp-breadcrumb__breadcrumb(separator-class="el-icon-arrow-right")
    slot
  .temp-breadcrumb__right
    slot(name="right")
      TempBreadcrumbButton(icon="s-home", to="/temp/admin")
</template>

<script>
export default {

  props: ['top'],

  computed: {

    classes() {
      const classes = [];

      if (this.top !== undefined) classes.push('top');
      return classes.map(v => 'temp-breadcrumb--' + v);
    },

  },

};
</script>

<style lang="sass">
.temp-breadcrumb
  display: flex
  justify-content: space-between
  align-items: center

  &--top
    background: var(--color--highlight-second-light)

    .el-breadcrumb

      &__inner
        color: var(--color--ui-main) !important

      &__inner.is-link
        color: var(--color--dark) !important
        transition: .2s ease-in-out

      &__inner.is-link:hover
        color: var(--color--font-main) !important

  &--top &__breadcrumb
    padding: .5em

  &--top &__right
    display: flex
    border-left: 1px solid var(--color--highlight-second-dark)
</style>