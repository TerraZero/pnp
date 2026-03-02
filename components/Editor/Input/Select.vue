<template lang="pug">
.editor-input-select(:class="classes")
  EditorToolLabel(v-if="label", :label="label")
  ElSelect.editor-input-select__select(v-bind="$attrs", v-on="$listeners", placeholder="No data", :popper-class="popperClass", @change="onChange")
    ElOption(v-for="value, key in realOptions", :key="key", :value="key", :label="value")
</template>

<script>
export default {

  props: ['label', 'options', 'gap'],

  inject: { 
    eslot: { default: null },
  },

  computed: {

    classes() {
      const classes = [];

      if (this.gap !== undefined) classes.push('gap');
      return classes.map(v => 'editor-input-select--' + v);
    },

    popperClass() {
      const classes = [];

      return 'editor-input-select-popper ' + classes.map(v => 'editor-input-select-popper--' + v).join(' ');
    },

    realOptions() {
      if (typeof this.options === 'string') {
        const options = {};
        const [ start, end ] = this.options.split('-').map(v => parseInt(v));
        for (let i = start; i <= end; i++) {
          options[i] = i;
        }
        return options;
      } else {
        return this.options;
      }
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
.editor-input-select

  &--gap
    margin-bottom: 1em

  &__select
    width: 100%
  
  &__select .el-input__inner
    background: #414141
    color: white

.editor-input-select-popper
  background: #414141

  .el-select-dropdown__item
    color: white

  .el-select-dropdown__item.hover
    background: #181818

</style>