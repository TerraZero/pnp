<template lang="pug">
.temp-tags-output(:class="classes")
  .temp-tags-output__tag(v-for="tag in tags", :key="tag.id")
    .temp-tags-output__cat {{ tag.cat }}
    .temp-tags-output__label {{ tag.label }}
</template>

<script>
const RemoteSystem = require('zero-system/src/RemoteSystem');

/** @type {import('~/custom/server/temp/Service/Temp.service')} */
let _temp = null;

export default {

  props: ['value', 'hide-cat'],

  async mounted() {
    _temp ??= await RemoteSystem.get('service.temp');
  
    this.tags = await _temp.getTags({
      ids: typeof this.value === 'string' ? this.value.split(',') : [],
    });
  },

  data() {
    return {
      tags: [],
    };
  },

  computed: {

    classes() {
      const classes = [];

      if (this.hideCat !== undefined) {
        classes.push('no-cat');
      }
      return classes.map(v => 'temp-tags-output--' + v);
    },

  },

};
</script>

<style lang="sass">
.temp-tags-output

  &__tag
    display: inline-flex
    font-weight: bold

  &__tag + &__tag
    margin-left: 1em

  &__cat
    padding: .2em .4em .2em .6em
    background: #252525
    border-top-left-radius: .5em
    border-bottom-left-radius: .5em
    border: 1px solid #252525

  &--no-cat &__cat
    display: none

  &__label
    padding: .2em .6em .2em .4em
    background: #454545
    border-top-right-radius: .5em
    border-bottom-right-radius: .5em
    border: 1px solid #252525

  &--no-cat &__label
    border-radius: .5em
</style>