<template lang="pug">
.custom-input-select-list(:class="classes")
  h3.custom-input-select-list__label(v-if="label") {{ label }}
  .custom-input-select-list__input
    ElPagination.custom-input-select-list__pager(background, layout="prev, pager, next", :page-size="this.configProxy.selected_items", :total="selectedResult?.pager?.items ?? 0", :current-page.sync="selectedPage", @current-change="selectedReload")
    ElTable.custom-input-select-list__selected(:data="selectedItems", v-loading="selectedLoading", empty-text="NO DATA", size="mini")
      ElTableColumn(v-for="label, key in fields", :key="key", :prop="key", :label="label")
      ElTableColumn(label="Controls")
        template(#header)
          ElInput(v-model="selected", size="mini", placeholder="Search", @input="onSelectedInput")
        template(slot-scope="{ row }")
          ElButtonGroup
            ElButton(size="mini", icon="el-icon-minus", type="danger", @click="onItem('unselect', row)")
            ElButton(size="mini", icon="el-icon-top", @click="onItem('top', row)")
            ElButton(size="mini", icon="el-icon-bottom", @click="onItem('bottom', row)")
            ElButton(size="mini", icon="el-icon-edit-outline", @click="onItem('goto', row)")
            ElButton(size="mini", icon="el-icon-copy-document", @click="onItem('popup', row)")
            ElButton(v-if="!configProxy.no_edit && !configProxy.only_ids", size="mini", icon="el-icon-edit", type="primary", @click="onItem('edit', row)")
  .custom-input-select-list__seperator
  .custom-input-select-list__input
    ElPagination.custom-input-select-list__pager(background, layout="prev, pager, next", :page-size="this.configProxy.search_items", :total="searchResult?.pager?.items ?? 0", :current-page.sync="searchPage", @current-change="searchReload")
    ElTable.custom-input-select-list__search(:data="searchItems", v-loading="searchLoading", empty-text="NO DATA", size="mini")
      ElTableColumn(v-for="label, key in fields", :key="key", :prop="key", :label="label")
      ElTableColumn(label="Controls")
        template(#header)
          ElInput(v-model="search", size="mini", placeholder="Search", @input="onSearchInput")
        template(slot-scope="{ row }")
          ElButtonGroup
            ElButton(icon="el-icon-plus", type="primary", @click="onItem('select', row)")
            ElButton(size="mini", icon="el-icon-edit-outline", @click="onItem('goto', row)")
            ElButton(size="mini", icon="el-icon-copy-document", @click="onItem('popup', row)")
  ElDialog(:visible.sync="open", width="90%", :close-on-click-modal="false", append-to-body)
    slot(v-if="open", :entity="entity", :row="row")
    template(#title)
      slot(v-if="open", name="title", :entity="entity", :row="row")
    template(#footer)
      ElButtonGroup(size="mini")
        slot(v-if="open", name="actions", :entity="entity", :row="row")
        ElButton(type="primary", @click="open = false") Save
</template>

<script>
import RemoteSystem from 'zero-system/src/RemoteSystem';
import TimingUtil from 'zero-util/src/TimingUtil';

export default {

  props: ['type', 'value', 'fields', 'label', 'config'],

  inject: ['zui'],

  watch: {

    type: {
      async handler(value) {
        this.storage = null;
        this.storage = await RemoteSystem.get('entity.' + value);
        this.reload();
      },
      immediate: true,
    },

    value: {
      async handler() {
        this.reload();
      },
      immediate: true,
    },

  },

  data() {
    return {
      /** @type {import('~/custom/server/entity/src/ContentEntityBase')} */
      storage: null,

      search: '',
      searchLoading: false,
      searchOutdated: false,
      searchPage: 1,
      searchResult: {},

      selected: '',
      selectedLoading: false,
      selectedOutdated: false,
      selectedPage: 1,
      selectedResult: {},

      open: false,
      entity: null,
      row: null,
    };
  },

  computed: {

    configProxy() {
      return Object.assign({
        selected_items: 10,
        search_items: 50,
        no_edit: false,
        only_ids: false,
      }, this.config || {});
    },

    valueProxy() {
      if (this.configProxy.only_ids) {
        return (this.value ?? []).map(v => {
          return { id: v };
        });
      } else {
        return this.value ?? [];
      }
    },

    classes() {
      const classes = [];

      if (this.searchOutdated) classes.push('search-outdated');
      if (this.selectedOutdated) classes.push('selected-outdated');
      return classes.map(v => 'custom-input-select-list--' + v);
    },

    searchItems() {
      return this.searchResult.items;
    },

    selectedItems() {
      return this.valueProxy.map(row => {
        const entity = this.selectedResult?.items?.find(v => v.id === row.id) ?? null;

        if (entity === null) return {};
        entity.meta.row = row;
        return entity;
      });
    },

  },

  methods: {

    async reload(entity = null) {
      if (this.storage !== null) {
        if (entity === null) {
          await this.searchReload();
          await this.selectedReload();
        } else {
          const reloadEntity = await this.storage.load(entity.id);

          let index = this.searchResult.items.findIndex(i => i.id === entity.id);
          if (index !== -1) this.$set(this.searchResult.items, index, reloadEntity);

          index = this.selectedResult.items.findIndex(i => i.id === entity.id);
          if (index !== -1) this.$set(this.selectedResult.items, index, reloadEntity);
        }
      }
    },

    async searchReload() {
      this.searchLoading = true;
      this.searchResult = await this.storage.search({
        '*': this.search,
        id: { notIn: this.valueProxy.map(v => v.id) },
      }, this.configProxy.search_items, this.searchPage - 1);
      this.searchLoading = false;
      this.searchOutdated = false;
    },

    async selectedReload() {
      this.selectedLoading = true;
      this.selectedResult = await this.storage.search({
        '*': this.selected,
        id: { in: this.valueProxy.map(v => v.id) },
      }, this.configProxy.selected_items, this.selectedPage - 1);
      this.selectedLoading = false;
      this.selectedOutdated = false;
    },

    onSearchInput: TimingUtil.debounce(function() {
      this.searchPage = 1;
      this.searchReload();
    }, 500, function() {
      this.searchOutdated = true;
    }),

    onSelectedInput: TimingUtil.debounce(function() {
      this.selectedPage = 1;
      this.selectedReload();
    }, 500, function() {
      this.selectedOutdated = true;
    }),

    async onItem(action, row) {
      let newValue = JSON.parse(JSON.stringify(this.valueProxy));

      switch (action) {
        case 'select':
          newValue.push({
            id: row.id,
          });
          this.$emit('input', this.toOutput(newValue));
          break;
        case 'unselect':
          newValue = newValue.filter(v => v.id !== row.id);
          this.$emit('input', this.toOutput(newValue));
          break;
        case 'edit':
          this.entity = row;
          this.row = this.value.find(v => v.id === row.id);
          this.open = true;
          break;
        case 'top':
          newValue = ((arr, i) => i > 0 ? ([arr[i - 1], arr[i]] = [arr[i], arr[i - 1]], arr) : arr)(newValue, newValue.findIndex(v => v.id === row.id));
          this.$emit('input', this.toOutput(newValue));
          break;
        case 'bottom':
          newValue = ((arr, i) => i < arr.length - 1 ? ([arr[i], arr[i + 1]] = [arr[i + 1], arr[i]], arr) : arr)(newValue, newValue.findIndex(v => v.id === row.id));
          this.$emit('input', this.toOutput(newValue));
          break;
        case 'goto':
          const route = await this.storage.route('edit', row);
          this.$router.push(route);
          break;
        case 'popup':
          const window = await this.zui.open(`/entity/${row.meta.type}/${row.id}`);
          window.on('close', () => this.reload(row));
          break;
      }
    },

    toOutput(value) {
      if (this.configProxy.only_ids) {
        return value.map(v => v.id);
      } else {
        return value;
      }
    },

  },

}
</script>

<style lang="sass">
.custom-input-select-list
  border: 1px solid var(--color--highlight-dark)
  background: var(--color--background)

  &--search-outdated &__search .el-table__row,
  &--search-outdated &__search .el-table__empty-block,
  &--selected-outdated &__selected .el-table__row,
  &--selected-outdated &__selected .el-table__empty-block
    background: var(--interact--outdated)

  &__search,
  &__selected
    margin: .5em
    width: calc(100% - 1em)

  &__seperator
    padding-top: 1em

  &__input
    position: relative

  &__pager
    position: sticky
    top: 0
    z-index: 1
    text-align: center

  &__label
    color: white
    background: var(--background--highlight)
    padding: .3em .5em
    margin: 0

</style>