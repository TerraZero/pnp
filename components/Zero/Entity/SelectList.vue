
<template lang="pug">
ElDialog.zero-entity-select-list(:class="classes", :title="title", :visible.sync="dialog", width="90%", :close-on-click-modal="false", append-to-body)
  .zero-entity-select-list__filter
    slot(name="filter", :doFilter="doFilter")
      ElInput(v-model="search", @input="doFilter(filter)") 
        template(#prepend) Search
  ElTable(v-if="table", :data="table", size="mini", empty-text=" ", v-loading="loading")
    slot
      ElTableColumn(v-for="(field, index) in fields", :key="index", :prop="index", :label="field")
      ElTableColumn(label="Operations")
        template(slot-scope="{ row }")
          ElButton(class="zero-entity-select-list__select", size="mini", @click="onSelect(row)") Select
          ElCheckbox(class="zero-entity-select-list__check")
  ElPagination.zero-entity-select-list__pager(background, layout="prev, pager, next", :current-page.sync="page", :total="total", @current-change="onChangePage")
</template>

<script>
import ZERO from '~/custom/plugins/zero.plugin';

export default {

  props: ['multi', 'exclude'],

  data() {
    return {
      dialog: false,
      info: null,
      page: 1,
      total: 0,
      table: null,
      typeInfo: null,
      typeKeys: null,
      search: null,
      filter: {},
      loading: false,
      _typeRef: null,
    };
  },

  computed: {

    classes() {
      const classes = [];

      if (this.multi) {
        classes.push('multi');
      } else {
        classes.push('single');
      }
      return 'zero-entity-select-list--' + classes.join(' zero-entity-select-list--');
    },

    type() {
      return this.info.type;
    },

    fields() {
      if (this.info.fields) return this.info.fields;
      const fields = {};
      for (const index in this.typeKeys) {
        fields[this.typeKeys[index]] = index;
      }
      return fields;
    },

    title() {
      return this.typeInfo?.label || 'None';
    },

  },

  methods: {

    async open(info) {
      this.info = info;
      this._typeRef = await ZERO.get(this.type);
      this.typeInfo = await this._typeRef.info();
      this.typeKeys = await this._typeRef.keys();
      this.update();
      this.dialog = true;
    },

    close() {
      this.dialog = false;
    },

    onSelect(row) {
      this.$emit('select', { row, dialog: this });
    },

    onChangePage() {
      this.update();
    },

    async doFilter(filter) {
      this.page = 1;
      this.filter = filter;
      await this.update();
    },

    async update() {
      this.loading = true;
      let filter = this.filter;
      if (this.search && this.typeKeys.label) {
        filter[this.typeKeys.label] = { contains: this.search };
      } else if (this.typeKeys.label) {
        delete filter[this.typeKeys.label];
      }
      if (this.info.exclude) {
        filter[this.typeKeys.id] = { notIn: this.info.exclude };
      } else if (this.exclude && Array.isArray(this.exclude) && this.exclude.filter(a => a).length) {
        filter[this.typeKeys.id] = { notIn: this.exclude };
      }
      this.table = await this._typeRef.list(filter, 10, this.page - 1);
      this.total = await this._typeRef.count(filter);
      this.loading = false;
    },

  },

}
</script>

<style lang="sass">
.zero-entity-select-list
  
  &__filter
    display: flex

  &__select,
  & &__check
    display: none

  &--multi &__check
    display: block

  &--single &__select
    display: block

  & &__pager
    text-align: center
    padding: .4em 0

</style>