<template lang="pug">
.editor-input-textarea
  EditorToolLabel(v-if="label", :label="label")
  ElInput.editor-input-textarea__input(type="textarea", :placeholder="label", v-bind="$attrs", v-on="$listeners", @input="onChange", :autosize="{ minRows: size?.min ?? 4, maxRows: size?.max ?? 10 }")
</template>

<script>
export default {

  props: ['label', 'size'],

  inject: { 
    eslot: { default: null },
  },

  methods: {

    onChange(value) {
      this.eslot?.onItemChange(this, value);
    },

  },

}
</script>

<style lang="sass">
.editor-input-textarea

  &__input .el-textarea__inner
    background-color: #414141
    border-color: white
    color: white
    transition: border-color .2s ease-in-out, background .2s ease-in-out

  &__input .el-textarea__inner:focus
    border-color: #00bdb5
    background-color: #121212

</style>