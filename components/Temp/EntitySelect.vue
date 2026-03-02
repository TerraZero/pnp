<template lang="pug">
TempDialog.temp-entity-select(:visible.sync="show", editor, inset="2em", :title="'Select ' + entity_type.label()")
  ElTable(:data="transformed")
    ElTableColumn(prop="id", label="ID")
    ElTableColumn(prop="label", label="Name")
    ElTableColumn(label="Operations")
      template(slot-scope="scope")
        EditorInputSwitch.temp-entity-select__select(v-model="scope.row.select", label="Select", border)
  .temp-entity-select__operations
    ElButton(type="primary", @click="onSubmit") Submit
</template>

<script>
export default {

  props: ['entity_type', 'excludes'],

  data() {
    return {
      show: false,
      search: '',
      result: [],
      pager: {
        current: 0,
        count: 0,
        pages: 0,
      },
    };
  },  

  computed: {

    transformed() {
      const items = [];

      for (const entity of this.result) {
        items.push({
          id: entity.id(),
          label: entity.label(),
          select: false,
          entity,
        });
      }
      return items;
    },

  },

  methods: {

    open() {
      this.show = true;
      this.reload();
    },

    async reload() {
      const list = await this.entity_type.list({
        label: { contains: this.search },
        id: { notIn: this.excludes },
      }, 10, this.pager.current);
      this.result = list.entities;
      this.pager = list.pager;
    },

    onSubmit() {
      this.$emit('submit', this.transformed.filter(v => v.select).map(v => v.entity));
      this.show = false;
    },

  },

};
</script>

<style lang="sass">
.temp-entity-select

  &__select
    min-height: 3em
    padding: .5em

  &__operations
    padding: 1em
    text-align: right
</style>