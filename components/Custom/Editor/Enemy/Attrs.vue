<template lang="pug">
.custom-editor-enemy-attrs
  .custom-editor-enemy-attrs__live
    .custom-editor-enemy-attrs__max 
      .custom-editor-enemy-attrs__label MAX
      .custom-editor-enemy-attrs__value {{ value.live.max }}
    .custom-editor-enemy-attrs__current
      .custom-editor-enemy-attrs__label CURRENT
      .custom-editor-enemy-attrs__value
        ElButton(size="mini", @click="onAddCurrent(-5)")
          .el-icon-minus
          .el-icon-minus
        EditorInputNumber(v-model="value.live.current", size="mini", compact, @input="onChange")
        ElButton(size="mini", @click="onAddCurrent(5)")
          .el-icon-plus
          .el-icon-plus
  .custom-editor-enemy-attrs__attrs
    .custom-editor-enemy-attrs__attr(v-for="attr, index in value.attrs", :key="index")
      .custom-editor-enemy-attrs__label {{ index.toUpperCase() }}
      EditorInputNumber.custom-editor-enemy-attrs__manuel(v-model="attr.manuel", size="mini", compact, @input="onChange")
      .custom-editor-enemy-attrs__value {{ attr.value + attr.manuel }}
      .custom-editor-enemy-attrs__bonus {{ attr.bonus }}
</template>

<script>
export default {

  props: ['value'],

  methods: {

    onAddCurrent(add) {
      this.value.live.current += add;
      this.onChange();
    },

    onChange() {
      this.$emit('change', this.value);
    },

  },

}
</script>


<style lang="sass">
.custom-editor-enemy-attrs

  &__live,
  &__max,
  &__current
    display: grid
    grid-template-columns: 1fr 1fr

  &__attrs
    display: grid
    grid-template-columns: 1fr 1fr 1fr

  &__attr
    display: grid
    grid-template-columns: repeat(4, 1fr)

  &__max,
  &__current,
  &__attr
    border: 2px solid white

    & > *
      padding: .4em .2em
      display: flex
      justify-content: center
      align-items: center

    & > * + *
      border-left: 2px solid white

</style>
      