<template lang="pug">
.zero-formulate
  FormulateForm.zero-formulate__form(v-if="schema && !error", v-model="values", :schema="schema", @submit="onSubmit")
  h2.zero-formulate__error(v-if="error") {{ error }}
</template>

<script>
import ZERO from '~/custom/plugins/zero.plugin';

export default {

  props: {
    form: {
      type: String,
      required: true,
    },
    inline: {
      type: Boolean,
    },
    info: {
      type: Object,
    },
  },

  inject: {
    wsc: { default: null },
  },

  created() {
    this._form = null;
    this.setup();
  },

  data() {
    return {
      values: null,
      schema: null,
      error: false,
    };
  },

  methods: {

    async setup() {
      if (this._form === null) {
        this._form = await ZERO.get(this.form);
        this._form.setMount(this);
        await this._form.doPrepare(this.info, this);
        this.schema = this._form.schema();
      }
    },

    onSubmit(values) {
      if (!this.inline) this._form.doSubmit();
      this.$emit('submit', { form: this._form });
    },

    setFatalError(error) {
      this.error = error;
    },

  },

}
</script>


<style lang="sass">
.zero-formulate
  --form-size: 18px
  --form-size-font: var(--form-size)
  --form-size-font-label: calc(var(--form-size) * 1.4)
  --form-size-border: calc(var(--form-size) / 18)
  --form-size-border-inline: calc(var(--form-size-border) * 2)
  --form-size-padding-input: calc(var(--form-size) / 8)
  --form-size-gap: calc(var(--form-size) / 2)
  --form-size-outer-gap: var(--form-size-gap)
  --form-size-input-color: calc(var(--form-size) * 2)
  --form-size-area-height: calc(var(--form-size) * 6)
  --form-color: black
  --form-color-input: var(--form-color)
  --form-color-disabled: #555
  --form-color-label: var(--form-color)
  --form-color-border: var(--form-color)
  --form-color-button: var(--form-color)
  --form-color-error: red
  --form-color-bg: white
  --form-color-bg-mark: #CCC
  --form-color-bg-input: var(--form-color-bg)
  --form-color-bg-disabled: #0003
  --form-color-bg-button: var(--form-color-bg-input)
  --form-color-bg-group: var(--form-color-bg-mark)

  font-size: var(--form-size)
  color: var(--form-color)
  padding: var(--form-size-outer-gap)

  & + &
    margin-top: var(--form-size-gap)

  &__form
    display: grid
    gap: var(--form-size-gap)

  input,
  button,
  select,
  textarea
    font-size: var(--form-size-font)
    box-sizing: border-box
    border: var(--form-size-border) solid var(--form-color-border)

    &:focus
      outline: var(--form-size-border) solid var(--form-color-border)

  input,
  select,
  textarea
    width: 100%
    padding: var(--form-size-padding-input) calc(var(--form-size-padding-input) * 2)
    background: var(--form-color-bg-input)
    color: var(--form-color-input)

    &[disabled]
      color: var(--form-color-disabled)
      background: var(--form-color-bg-disabled)

  input[type="color"]
    height: var(--form-size-input-color)

  textarea
    min-width: 100%
    max-width: 100%
    min-height: var(--form-size-area-height)

  button
    padding: calc(var(--form-size-padding-input) * 2) calc(var(--form-size-padding-input) * 4)
    color: var(--form-color-button)
    background: var(--form-color-bg-button)

    &:hover
      cursor: pointer

  // group-item remove button. should handled like button.
  .formulate-input-group-repeatable-remove
    display: inline-block
    justify-self: start
    font-size: var(--form-size-font)
    box-sizing: border-box
    border: var(--form-size-border) solid var(--form-color-border)
    padding: calc(var(--form-size-padding-input) * 2) calc(var(--form-size-padding-input) * 4)
    color: var(--form-color-button)
    background: var(--form-color-bg-button)
    margin-top: var(--form-size-gap)

    &:hover
      cursor: pointer

    &:focus
      outline: var(--form-size-border) solid var(--form-color-border)

  label
    color: var(--form-color-label)

  .formulate-input-group-repeatable
    display: grid
    gap: var(--form-size-gap)

  .form-grid-2 > .formulate-input-wrapper > .formulate-input-group > .formulate-input-group-repeatable
    grid-template-columns: 1fr 1fr

  .form-grid-3 > .formulate-input-wrapper > .formulate-input-group > .formulate-input-group-repeatable
    grid-template-columns: 1fr 1fr 1fr

  .form-grid-4 > .formulate-input-wrapper > .formulate-input-group > .formulate-input-group-repeatable
    grid-template-columns: 1fr 1fr 1fr 1fr

  [data-classification="group"] > .formulate-input-wrapper > label
    font-size: var(--form-size-font-label)

  [data-classification="box"] > .formulate-input-wrapper
    display: flex
    gap: var(--form-size-gap)

  [data-type="hidden"]
    display: none

  // group-item add button.
  .formulate-input-group-add-more
    margin-top: var(--form-size-gap)

  .form-frame

    > .formulate-input-wrapper
      border: 1px solid var(--form-color-border)
      padding: var(--form-size-gap)
      background: var(--form-color-bg-group)

    > .formulate-input-wrapper > .formulate-input-group > .formulate-input-grouping > .formulate-input-group-repeatable

      & + .formulate-input-group-repeatable
        border-top: var(--form-size-border-inline) solid var(--form-color-border)
        margin-top: var(--form-size-gap)

  .form-hide
    display: none

  .formulate-input-errors
    color: var(--form-color-error)
    font-size: .8em
</style>
