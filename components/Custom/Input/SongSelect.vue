<template lang="pug">
.custom-input-song-select
  h3.custom-input-song-select__label(v-if="label") {{ label }}
  ElSelect.custom-input-song-select__input(:value="value", @input="$emit('input', $event)")
    ElOption(v-for="option in options", :key="option", :value="'/' + option") {{ option }}
</template>

<script>
import namespaces from '~/custom/namespaces/sounds.namespace';

export default {

  props: ['value', 'label'],

  computed: {

    classes() {
      const classes = [];

      return classes.map(v => 'custom-input-song-select--' + v);
    },

    options() {
      return namespaces;
    },

  },

}
</script>

<style lang="sass">
.custom-input-song-select

  &__label
    margin: 0

  &__input
    display: block

</style>