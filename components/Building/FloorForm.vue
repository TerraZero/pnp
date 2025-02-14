<template lang="pug">
.building-floor-form
  ElTable(:data="sorted", size="mini", empty-text=" ")
    ElTableColumn(prop="id", label="ID")
    ElTableColumn(prop="floor", label="Floor")
    ElTableColumn(prop="name", label="Name")
    ElTableColumn
      template(slot-scope="{ row }")
        ElButton(type="primary", icon="el-icon-edit", @click="onEdit(row)") Edit
</template>

<script>
const RemoteSystem = require('zero-system/src/RemoteSystem');

/** @type {import('~/custom/server/building/Entity/Floor.entity')} */
let floorStorage = null;
/** @type {import('~/custom/server/form/Remote/Form.remote')} */
let forms = null;

export default {

  inject: {
    editor: { default: null },
    ws: { default: null },
  },

  async mounted() {
    floorStorage = await RemoteSystem.get('entity.floor');
    forms = await RemoteSystem.get('remote.form');

    this.floors = await floorStorage.getFloorsFromBuilding(this.editor.building.id);
    console.log(this.floors);
  },  

  data() {
    return {
      floors: [],
    };
  },

  computed: {

    sorted() {
      return this.floors.sort((a, b) => {
        return a.floor - b.floor;
      });
    },  

  },

  methods: {

    async onEdit(row) {
      await forms.open('form.generate.edit', {
        game: 'paycyber',
        id: row.id,
        generate: 'entity.floor',
      }, {}, async () => {
        this.floors = await floorStorage.getFloorsFromBuilding(this.editor.building.id);
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
      