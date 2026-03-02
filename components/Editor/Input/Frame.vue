<template lang="pug">
.editor-input-editor(:class="classes")
  .editor-input-editor__header(v-if="$slots.header || label")
    EditorToolLabel.editor-input-editor__label(v-if="label", :label="label")
    .editor-input-editor__side
      slot(name="header")
  .editor-input-editor__field
    slot
  .editor-input-editor__state(v-if="type")
    | {{ message }}
</template>

<script>
export default {

  props: ['label'],

  data() {
    return {
      type: '',
      message: '',
    };
  },

  computed: {

    classes() {
      const classes = [];

      if (this.type) classes.push('state-' + this.type);
      return classes.map(v => 'editor-input-editor--' + v);
    },

  },

  methods: {

    setState(type, message) {
      this.type = type;
      this.message = message;
    },

    resetState() {
      this.type = '';
      this.message = '';
    },

  },

}
</script>

<style lang="sass">
.editor-input-editor
  background: var(--color--main)

  &__header
    display: flex
    justify-content: space-between
    align-items: center

  &__side
    display: flex

  &__label
    padding: .2em

  &__state
    font-size: .9em
    padding: .2em

  &--state-success &__state
    background: var(--success-status)

  &--state-warning &__state
    background: var(--warning-status)

  &--state-error &__state
    background: var(--error-status)

</style>