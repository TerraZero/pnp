<template lang="pug">
EditorInputSelect.temp-tags-input__select(:value="internValue", @input="onInput", :label="label", :options="options", placeholder="No data", multiple, filterable, allow-create, remote, :remote-method="onRemote", :loading="loading")
</template>

<script>
import Util from '~/custom/server/Util';

const RemoteSystem = require('zero-system/src/RemoteSystem');

/** @type {import('~/custom/server/temp/Service/Temp.service')} */
let _temp = null;

export default {

  props: ['value', 'label', 'cat'],

  async mounted() {
    _temp ??= await RemoteSystem.get('service.temp');
    this.onRemote('');
  },

  data() {
    return {
      options: {},
      loading: false,
    };
  },

  computed: {

    internValue() {
      if (typeof this.value === 'string') {
        return this.value.length ? this.value.split(',') : [];
      } else {
        return [];
      }
    },

  },

  methods: {

    async onInput(value) {
      for (const index in value) {
        if (!Util.isId(value[index])) {
          const tag = await _temp.setTag(this.cat, value[index]);
          value[index] = tag.id;
        }
      }
      await this.onRemote();
      this.$emit('input', value.join(','));
    },

    async onRemote(search) {
      this.loading = true;
      const q = {
        cat: this.cat,
        search,
      };
      if (this.internValue.length) {
        q.selected = this.internValue;
      }
      this.options = Util.mapObject(await _temp.getTags(q), (k, v) => {
        return [v.id, v.cat + ': ' + v.label];
      });
      this.loading = false;
    },

  },

};
</script>

<style lang="sass">

</style>