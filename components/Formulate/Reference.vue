<template lang="pug">
.formulate-reference.formulate-input-element(:class="classes", :data-type="context.type")
  ElTable(v-if="table.length", :data="table", size="mini", :show-header="false", empty-text=" ", v-loading="loading")
    ElTableColumn(v-for="(field, index) in fields", :key="index", :prop="index", :label="field")
    ElTableColumn(label="Operations")
      template(slot-scope="{ $index }")
        ElButton(v-if="fieldop.select", size="mini", @click="onSelect($index)") Select
        ElButton(v-if="fieldop.edit", size="mini", @click="onEdit($index)") Edit
        ElButton(v-if="fieldop.delete", type="danger", size="mini", @click="onDelete($index)") Delete
  ElPagination.formulate-reference__pager(v-if="values.length > 10", background, layout="prev, pager, next", :current-page.sync="page", :total="values.length")
  ElButton(v-if="(!single || !table.length) && fieldop.add", class="formulate-reference__add", @click="onAdd")
    span.el-icon-circle-plus-outline
  ZeroEntitySelectList(ref="dialog", @select="onSelectResult")
</template>

<script>
import ZERO from '~/custom/plugins/zero.plugin';

export default {

  props: {

    context: {
      type: Object,
      required: true,
    },

  },

  watch: {

    model() {
      this.update();
    },

  },

  async mounted() {
    this._refType = await ZERO.get(this.refID, { timeout: 40000 });
    this.refKeys = await this._refType.keys();
    await this.update();
  },

  data() {
    return {
      loading: false,
      _refType: null,
      refKeys: null,
      loaded: {},
      page: 1,
    };
  },

  computed: {

    classes() {
      const classes = [];

      classes.push('formulate-input-element--' + this.context.class);
      return classes;
    },

    model() {
      return this.context.model;
    },

    fieldschema() {
      return this.context.slotProps.component.fieldschema ?? null;
    },

    single() {
      return this.fieldschema.options.single ?? false;
    },

    fields() {
      if (!this.refKeys) return [];
      const fields = {};
      for (const index in this.refKeys) {
        fields[this.refKeys[index]] = index;
      }
      return fields;
    },

    fieldop() {
      return {
        add: true,
        edit: true,
        delete: true,
        select: true,
        ...this.fieldschema.options.op,
      };
    },

    refID() {
      return this.fieldschema.options.ref ?? 'entity.' + this.fieldschema.type.toLowerCase();
    },

    title() {
      return 'Select ' + this.refID.split('.')[1];
    },

    dialog() {
      return this.$refs.dialog;
    },

    values() {
      const values = [];
      if (this.single) {
        if (this.model.id) {
          values.push(this.model.id);
        }
      } else {
        for (const item of this.model) {
          values.push(item.id);
        }
      }
      return values;
    },

    table() {
      return this.values.slice((this.page - 1) * 10, this.page * 10).map(id => {
        if (this.loaded[id]) return this.loaded[id];
        const row = { id };

        for (const field in this.fields) {
          if (field === 'id') continue;
          row[field] = '<LADE>';
        }
        return row;
      });
    },

  },

  methods: {

    addValue(value) {
      if (this.single) {
        this.setValue(value);
      } else {
        this.context.model.push({ id: value });
      }
    },

    setValue(value, index = 0) {
      if (this.single) {
        this.context.model = { id: value };
      } else {
        this.$set(this.model, index, { id: value });
      }
    },

    async onEdit(index = 0) {
      /** @type {import('~/custom/server/form/Remote/Form.remote')} */
      const forms = await ZERO.get('remote.form');

      forms.open('form.generate.edit', { id: this.values[index], generate: this.refID }, {}, () => {
        this.loadMetaData(this.values[index], true);
      });
    },

    onPageChange() {

    },

    onAdd() {
      this.dialog.open({
        type: this.refID,
        exclude: this.getExclude(),
        data: {
          add: true,
        },
      });
    },

    onSelect(index) {
      this.dialog.open({
        type: this.refID,
        exclude: this.getExclude(index),
        data: {
          selected: index,
        },
      });
    },

    onDelete(index) {
      if (this.single) {
        this.context.model = [];
      } else {
        this.model.splice(index, 1);
      }
    },

    onSelectResult({ dialog, row }) {
      if (dialog.info.data.add) {
        this.addValue(row.id);
      } else if (dialog.info.data.selected !== undefined) {
        this.setValue(row.id, dialog.info.data.selected);
      }
      this.dialog.close();
    },

    getExclude(ignore = null) {
      return this.values.filter((v, i) => {
        return i !== ignore;
      });
    },

    async update() {
      this.loading = true;
      if (this.values.length && this._refType) {
        const loads = [];
        for (const id of this.values) {
          loads.push(this.loadMetaData(id));
        }
        await Promise.all(loads);
      }
      this.loading = false;
    },

    async loadMetaData(id, overwrite = false) {
      if (!this.loaded[id] || overwrite) {
        this.$set(this.loaded, id, await this._refType.load(id));
      }
      return this.loaded[id];
    },

  },

}
</script>

<style lang="sass">
.formulate-reference
  border: 1px solid black
  padding: .2em
  box-sizing: border-box
  
  &__input-wrapper
    display: flex

  &__add
    width: 100%

  & &__pager
    text-align: center
    padding: .4em 0

</style>
  