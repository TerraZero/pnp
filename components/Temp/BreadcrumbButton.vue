<template lang="pug">
.temp-breadcrumb-button(@click="onClick")
  span(:class="classes")
</template>

<script>
export default {

  props: ['icon', 'to'],

  computed: {

    classes() {
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

  &:hover
    background: var(--color--highlight-second-light)
</style>