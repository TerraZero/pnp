<template lang="pug">
.building-floor-form
  ElTable(:data="sorted", size="mini", empty-text=" ")
    ElTableColumn(prop="id", label="ID")
    ElTableColumn(prop="floor", label="Floor")
    ElTableColumn(prop="name", label="Name")
    ElTableColumn
      template(slot-scope="{ row }")
        ElButton(size="mini", icon="el-icon-aim", @click="onSelect(row)")
        ElButton(type="primary", size="mini", icon="el-icon-edit", @click="onEdit(row)")
    
</template>

<script>
const RemoteSystem = require('zero-system/src/RemoteSystem');

/** @type {import('~/custom/server/form/Remote/Form.remote')} */
let forms = null;

export default {

  inject: {
    editor: { default: null },
    ws: { default: null },
  },

  async mounted() {
    forms = await RemoteSystem.get('remote.form');
  },  

  data() {
    return {
      gap: 10,
    };
  },

  computed: {

    floors() {
      return this.editor.floors;
    },

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
      });
    },

    onSelect(row) {
      this.editor.setSelectFloor(row.id);
    },

  },

}
</script>


<style lang="sass">
.building-floor-form

  &__form
    display: grid
    gap: .5em
    margin: .5em

</style>
      