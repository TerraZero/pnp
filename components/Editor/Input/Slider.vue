<template lang="pug">
.editor-input-slider
  EditorToolLabel.editor-input-slider__label(v-if="label", :label="label", :warn="isWarn")
  .editor-input-slider__element
    ElSlider(:value="realValue", :min="min", :max="realMax", @input="onInput", :step="step ?? 1")
    ElInputNumber.editor-input-slider__input(:value="realValue", size="mini", @input="onInput")
</template>

<script>
export default {

  props: ['value', 'min', 'max', 'label', 'track', 'step', 'fix'],

  inject: {
    eslot: { default: null },
  },

  watch: {

    value(value) {
      this.realValue = value;
    },

    max(value) {
      this.realMax = value;
    },

  },

  data() {
    let max = this.max;
    if (this.value > max) {
      const sektor = this.getSektor(this.value) - 1;
      const faktor = Math.floor(this.value / Math.pow(10, sektor));
      max = (faktor + 1) * Math.pow(10, sektor);
    }
    return {
      originalValue: this.value,
      realValue: this.value,
      realMax: max,
      lock: null,
    };
  },

  computed: {

    isWarn() {
      return this.realValue !== this.originalValue;
    },

  },

  methods: {

    getSektor(number) {
      return Math.floor(Math.log10(number || 1)) + 1;
    },

    onInput(number) {
      if (this.fix !== undefined) {
        if (number === this.realMax) {
          if (this.lock === null) {
            this.realMax += Math.pow(10, this.getSektor(number) - 1);
          }
          this.lock = number;
        } else if (this.lock !== number && number !== this.realMax) {
          this.lock = null;
        }
      }
      if (this.eslot && this.track) {
        if (this.originalValue !== number) {
          this.eslot.warn(this.track);
        } else {
          this.eslot.warn(this.track, false);
        }
      }
      this.$emit('input', number);
      this.realValue = number;
      this.eslot?.onItemChange(this, number);
    },

  },

}
</script>

<style lang="sass">
.editor-input-slider
  margin: 0
  padding: .5em 8px 0
  background: var(--color--form--element)

  &__element
    display: grid
    grid-template-columns: 1fr min-content
    gap: 1em
    padding: 0 calc(1em - 8px)

  &__input
    margin: 4px 0

</style>