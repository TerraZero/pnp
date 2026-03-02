<template lang="pug">
EditorInputSelect.temp-tags-input__select(:value="internValue", @input="onInput", :label="label", :options="options", placeholder="No data", multiple, filterable, allow-create)
</template>

<script>
export default {

  props: ['value', 'label', 'sep', 'options'],

  computed: {

    internValue() {
      if (!this.value || this.value.length === 0) return [];
      return (this.value ?? '').split(this.sep ?? ',');
    },

  },

  methods: {

    onInput(value) {
      this.$emit('input', value.join(this.sep ?? ','));
    },

  },

};
</script>

<style lang="sass">

</style>