<template lang="pug">
.custom-input-image-select
  h3.custom-input-image-select__label(v-if="label") {{ label }}
  .custom-input-image-select__wrapper
    ElSelect.custom-input-image-select__input(:value="value", @input="$emit('input', $event)", :placeholder="label", :size="size")
      ElOption(v-for="option in options", :key="option", :value="'/' + option") {{ option }}
    .custom-input-image-select__preview
      ElButton.custom-input-image-select__preview-button(icon="el-icon-picture", @click="open = !open", :size="size")
  ElDialog(:visible.sync="open", width="90%", :close-on-click-modal="false", append-to-body)
    ElImage(:src="'/eldritch' + value")
</template>

<script>
import namespaces from '~/custom/namespaces/images.namespace';

export default {

  props: ['value', 'label', 'size'],

  data() {
    return {
      open: false,
    };
  },

  computed: {

    classes() {
      const classes = [];

      return classes.map(v => 'custom-input-image-select--' + v);
    },

    options() {
      return namespaces;
    },

  },

}
</script>

<style lang="sass">
.custom-input-image-select

  &__label
    margin: 0

  &__input
    width: 100%

  &__wrapper
    display: flex

  &__preview-button
    height: 100%

</style>