<template lang="pug">
.editor-input-textfield(:class="classes")
  EditorToolLabel(v-if="label", :label="label")
  ElInput.editor-input-textfield__input(v-bind="$attrs", v-on="$listeners", @input="onChange")
</template>

<script>
export default {

  props: ['label', 'gap'],

  inject: { 
    eslot: { default: null },
  },

  computed: {

    classes() {
      const classes = [];

      if (this.gap !== undefined) classes.push('gap');
      return classes.map(v => 'editor-input-textfield--' + v);
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
.editor-input-textfield

  &--gap
    margin-bottom: 1em

  &__input .el-input__inner
    background-color: #414141
    border-color: white
    color: white
    transition: border-color .2s ease-in-out, background .2s ease-in-out

  &__input .el-input__inner:focus
    border-color: #00bdb5
    background-color: #121212

</style>