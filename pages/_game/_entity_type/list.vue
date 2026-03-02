<template lang="pug">
.page-game-entity-type-list
  ElTable(:data="result.items", v-loading="loading", empty-text="NO DATA", size="mini")
    ElTableColumn(v-for="label, key in fields", :key="key", :prop="key", :label="label")
    ElTableColumn(label="Controls")
      template(#header)
        ElInput(v-model="search", size="mini", placeholder="Search", @input="onSearch")
      template(slot-scope="{ row }")
        ElButtonGroup
          ElButton(type="primary", size="mini", icon="el-icon-edit-outline", @click="onItem('goto', row)")
  ElPagination.page-game-entity-type-list__pager(background, layout="prev, pager, next", :page-size="100", :total="result?.pager?.items ?? 0", :current-page.sync="page", @current-change="onSearch")
</template>

<script>
import RemoteSystem from 'zero-system/src/RemoteSystem';
import TimingUtil from 'zero-util/src/TimingUtil';

/** @type {import('~/custom/server/entity/src/ContentEntityBase')} */
let _Storage = null;

export default {

  async asyncData({ params }) {
    const data = {};
    if (_Storage === null || _Storage.type !== params.entity_type) _Storage = await RemoteSystem.get('entity.' + params.entity_type);
    data.fields = await _Storage.getInfoList();
    data.params = params;
    return data;
  },

  data() {
    this.onSearch();
    return {
      search: '',
      result: {},
      loading: false,
      page: 1,
    };
  },

  methods: {

    async reload() {
      this.result = await _Storage.search(this.search, 100, this.page - 1);
      this.page = this.result.pager.current;
      this.loading = false;
    },

    onSearch: TimingUtil.debounce(function() {
      this.reload();
    }),

    async onItem(action, row) {
      switch (action) {
        case 'goto':
          const route = await _Storage.route('edit', row);
          this.$router.push(route);
          break;
      }
    },

  },

}
</script>

<style lang="sass">
.page-game-entity-type-list

  &__pager
    text-align: center
    padding-top: .5em
</style>