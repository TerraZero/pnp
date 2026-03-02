<template lang="pug">
.editor-input-image-select(:class="classes")
  EditorToolLabel(v-if="label", :label="label + (prefix ? ' (' + prefix + ')' : '')")
  ElSelect.editor-input-image-select__select(v-bind="$attrs", v-on="$listeners", placeholder="No data", :popper-class="popperClass", filterable, @change="onChange")
    ElOption(v-for="value, key in realOptions", :key="key", :value="key", :label="value")
</template>

<script>
import ImagesList from '~/custom/namespaces/images.namespace';

export default {

  props: ['label', 'prefix', 'gap'],

  inject: { 
    eslot: { default: null },
  },

  computed: {

    classes() {
      const classes = [];

      if (this.gap !== undefined) classes.push('gap');
      return classes.map(v => 'editor-input-image-select--' + v);
    },

    popperClass() {
      const classes = [];

      return 'editor-input-image-select-popper ' + classes.map(v => 'editor-input-image-select-popper--' + v).join(' ');
    },

    realOptions() {
      const options = {};
      for (const index in ImagesList) {
        options[(this.prefix ?? '') + index] = ImagesList[index];
      }
      return options;
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
.editor-input-image-select

  &--gap
    margin-bottom: 1em

  &__select
    width: 100%
  
  &__select .el-input__inner
    background: #414141
    color: white

.editor-input-image-select-popper
  background: #414141

  .el-select-dropdown__item
    color: white

  .el-select-dropdown__item.hover
    background: #181818

</style>