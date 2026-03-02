<template lang="pug">
EditorInputSelect(v-bind="$attrs", v-on="$listeners", :options="options", placeholder="No data")
</template>

<script>
const RemoteSystem = require('zero-system/src/RemoteSystem');

/** @type {import('~/custom/server/entity/src/ContentEntityBase')} */
let _storage = null;

export default {

  props: ['type', 'params'],

  async created() {
    _storage = await RemoteSystem.get('entity.' + this.type);
    this.options = await _storage.getOptions(this.params);
  },

  data() {
    return {
      options: null,
    };
  },

}
</script>

<style lang="sass">
</style>