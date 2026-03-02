<template lang="pug">
.entity-zui-buttons
  EditorInputButtons.entity-zui-button(:buttons="buttons", @click="onClick")
</template>

<script>
import RemoteSystem from 'zero-system/src/RemoteSystem';
import JSONUtil from 'zero-util/src/JSONUtil';

let _storage = null;

export default {

  inject: ['zui'],

  props: ['entity', 'params'],

  async created() {
    _storage ??= await RemoteSystem.get('entity.' + this.params.entity_type);
    const info = await _storage.info();
    this.windows = info.windows;
  },

  data() {
    return {
      windows: null,
    };
  },  

  computed: {

    buttons() {
      const buttons = [];

      for (const key in this.windows) {
        if (this.windows[key].edit) {
          const button = {
            key,
            label: this.windows[key].edit,
            type: 'default',
            required: this.windows[key].required ?? [],
          };
          buttons.push(button);
        }
      }
      return buttons;
    },

  },

  methods: {

    onClick(button) {
      for (const field of button.required) {
        if (!JSONUtil.hasDeep(this.entity, field)) {
          this.$notify.error('Please fill field "' + field + '" before.');
          return;
        }
      }
      this.zui.inlineEntity(this.params.entity_type, button.key, {
        entity: this.entity,
      });
    },

  },

};
</script>

<style lang="sass">
.entity-zui-buttons
  padding-top: .5em

</style>