<template lang="pug">
.building-form
  ElButton(type="primary", icon="el-icon-edit", @click="onEdit") Edit
</template>

<script>
const RemoteSystem = require('zero-system/src/RemoteSystem');

/** @type {import('~/custom/server/building/Entity/Building.entity')} */
let buildingStorage = null;
/** @type {import('~/custom/server/form/Remote/Form.remote')} */
let forms = null;

export default {

  inject: {
    editor: { default: null },
    ws: { default: null },
  },

  async mounted() {
    buildingStorage = await RemoteSystem.get('entity.building');
    forms = await RemoteSystem.get('remote.form');
  },  

  data() {
    return {
      
    };
  },

  computed: {

  },

  methods: {

    async onEdit() {
      await forms.open('form.generate.edit', {
        game: 'paycyber',
        id: this.editor.building.id,
        generate: 'entity.building',
      }, {}, async ({ result }) => {
        if (result === 'abort') return;
        this.editor.building = await buildingStorage.load(result.id, true);
      });
    },

  },

}
</script>


<style lang="sass">
.building-form
  display: grid
  gap: .5em
  margin: .5em

</style>
    