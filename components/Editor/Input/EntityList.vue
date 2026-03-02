<template lang="pug">
.editor-input-entity-list(:class="classes")
  EditorInputTextfield.editor-input-entity-list__search.std-margin(v-model="search", :label="label")
  ElTable.editor-input-entity-list__table(:data="items", empty-text="No Data")
    ElTableColumn(v-for="column in realColumns", :key="column.prop", v-bind="column")
    ElTableColumn(:label="controlLabel")
      template(slot-scope="scope")
        slot(v-bind="scope")
</template>

<script>
const RemoteSystem = require('zero-system/src/RemoteSystem');

/** @type {import('~/custom/server/entity/src/ContentEntityBase')} */
let _storage = null;
/** @type {import('~/custom/server/entity/Service/Storage.service').T_ModelSchema} */
let _schema = null;

export default {

  props: ['storage', 'fields', 'label', 'control-label'],

  watch: {

    storage: {
      async handler(value) {
        _storage = await RemoteSystem.get(value);
        this.load();
      }, 
      immediate: true,
    },

  },

  mounted() {
    this.load();
  },

  data() {
    return {
      search: '',
      page: 0,
      items: [],
      realFields: this.fields ?? null,
      realColumns: null,
    };
  },

  computed: {

    classes() {
      const classes = [];

      return classes.map(v => 'editor-input-entity-list--' + v);
    },

  },

  methods: {

    async load() {
      if (_storage) {
        _schema = await _storage.schema();
        if (this.realColumns === null) {
          this.realColumns = (this.realFields || []).map(v => {
            const fieldschema = _schema.fields.find(field => field.name === v);
            return {
              prop: v,
              label: fieldschema.options.label ?? fieldschema.name,
            };
          });
        }
        this.items = await _storage.list(this.search, 5, this.page);
      }
    },

    onClick(button) {
      this.$emit('click', button);
    },

  },

}
</script>

<style lang="sass">
.editor-input-entity-list
  text-align: left

</style>