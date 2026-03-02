<template lang="pug">
.editor-input-multi-switch(:class="classes")
  ElRadioGroup(:value="value", @input="$emit('input', $event)", size="mini")
    ElRadioButton.editor-input-multi-switch__button(v-for="button in buttons", :key="button.key", :label="button.key", size="mini")
      .editor-input-multi-switch__icon(v-if="button.icon", :class="button.icon")
      .editor-input-multi-switch__label(v-if="button.label") {{ button.label }}
  ElButtonGroup.editor-input-multi-switch__group
    ElButton(v-if="can('add')", icon="el-icon-plus", size="mini", @click="onAdd")
    ElButton(v-if="can('delete')", type="danger", icon="el-icon-minus", size="mini", @click="onDelete")
  .editor-input-multi-switch__overlay(v-if="can('add')")
    ElInput(v-model="input", size="mini", @keyup.native.enter="onSubmit")
    ElButtonGroup.editor-input-multi-switch__group
      ElButton(type="primary", icon="el-icon-plus", size="mini", @click="onSubmit")
      ElButton(type="danger", icon="el-icon-close", size="mini", @click="onClose")
</template>

<script>
export default {

  props: ['value', 'buttons', 'actions'],

  data() {
    return {
      show: false,
      input: '',
    };
  },

  computed: {

    classes() {
      const classes = [];

      if (this.show) classes.push('show');
      return classes.map(v => 'editor-input-multi-switch--' + v);
    },

    current() {
      return this.buttons.find(v => v.key === this.value);
    },

  },

  methods: {

    can(action) {
      if (this.actions) {
        return this.actions.includes(action);
      }
      return false;
    },

    onAdd() {
      this.show = true;
    },

    onClose() {
      this.show = false;
      this.input = '';
    },

    onSubmit() {
      this.$emit('action', { action: 'add', input: this.input });
      this.onClose();
    },

    onDelete() {
      this.$emit('action', { action: 'delete', input: this.value });
    },

  },

}
</script>

<style lang="sass">
.editor-input-multi-switch
  display: flex
  text-align: right
  position: relative

  &__button
    border-width: 0

  &__button .el-radio-button__inner
    background: #181818
    color: white

  &__button .el-radio-button__orig-radio:checked+.el-radio-button__inner
    background: #00bdb5

  &__description
    height: 100%

  &__description-text
    display: inline-flex
    align-items: center
    height: 100%
    padding: 0 .5em
    background: #181818
    border-radius: 5px 0 0 5px

  &__overlay
    position: absolute
    inset: 0
    display: none
    z-index: 2

  &--show &__overlay
    display: flex

  &__group
    flex-shrink: 0

</style>