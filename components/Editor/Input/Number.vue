<template lang="pug">
.editor-input-number(:class="classes")
  EditorToolLabel(v-if="label", :label="label")
  ElInputNumber.editor-input-number__input(v-bind="$attrs", v-on="$listeners", @input="onChange")
</template>

<script>
export default {

  props: ['label', 'gap', 'compact'],

  inject: { 
    eslot: { default: null },
  },

  computed: {

    classes() {
      const classes = [];

      if (this.gap !== undefined) classes.push('gap');
      if (this.compact !== undefined) classes.push('compact');
      return classes.map(v => 'editor-input-number--' + v);
    },

  },

  methods: {

    onChange(value) {
      this.eslot?.onItemChange(this, value);
    },

  },

}
</script>

<style lang="sass">
.editor-input-number

  &--gap
    margin-bottom: 1em

  &--compact &__input
    width: 90px

  &__input .el-input__inner
    background-color: #414141
    border-color: white
    color: white
    transition: border-color .2s ease-in-out, background .2s ease-in-out

  &__input .el-input__inner:focus
    border-color: #00bdb5
    background-color: #121212

</style>