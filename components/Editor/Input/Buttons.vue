<template lang="pug">
.editor-input-buttons(:class="classes")
  ElButtonGroup
    ElButton.editor-input-buttons__button(v-for="button in buttons", :key="button.key || button.icon", v-bind="button", @click="onClick(button)", size="mini")
      span(v-if="button.label") {{ button.label }}
</template>

<script>
export default {

  props: ['buttons', 'gap'],

  computed: {

    classes() {
      const classes = [];

      if (this.gap !== undefined) classes.push('gap');
      return classes.map(v => 'editor-input-buttons--' + v);
    },

  },

  methods: {

    onClick(button) {
      this.$emit('click', button);
    },

  },

}
</script>

<style lang="sass">
.editor-input-buttons
  text-align: right

  &--gap
    margin-bottom: 1em

  &__button.el-button--primary
    background-color: #00bdb5
</style>