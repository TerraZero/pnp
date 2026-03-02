<template lang="pug">
.page-temp-admin
  TempBreadcrumb(top)
    ElBreadcrumbItem Admin
  .page-temp-admin__content
    h1 Temp Admin
    .page-temp-admin__operations
      ElButton(type="primary", icon="el-icon-notebook-2", @click="onLogs") Logs
      ElButton(type="primary", @click="onControl") Control
      ElButton(type="primary", @click="onScreen") Screen
    ElTable.page-temp-admin__types(:data="typesTransform")
      ElTableColumn(prop="label", label="Name")
      ElTableColumn(label="Operations")
        template(slot-scope="scope")
          ElButton(type="primary", size="small", icon="el-icon-document-copy", @click="onList(scope)") List
          ElButton(type="primary", size="small", icon="el-icon-document-add", @click="onAdd(scope)") Add
</template>

<script>
const RemoteSystem = require('zero-system/src/RemoteSystem');

/** @type {import('~/custom/server/action/Remote/Router.remote')} */
let _router = null;

export default {

  async asyncData({ params }) {
    _router ??= await RemoteSystem.get('remote.router');
    /** @type {import('~/custom/server/temp/Remote/TempStorage.remote')} */
    const storage = await RemoteSystem.get('remote.tempstorage');
    const types = await storage.getTypes();

    return { params, types };
  },

  computed: {
    
    typesTransform() {
      const transform = [];

      console.log(this.types);

      for (const type in this.types) {
        const row = {};
        const item = this.types[type];
        if (!item.definition.options?.meta?.temp) continue;
        row.type = item;
        row.label = item.definition.name ?? type;
        transform.push(row);
      }
      return transform;
    },

  },

  methods: {

    onList(scope) {
      _router.goto(scope.row.type.route('base'));
    },

    onAdd(scope) {
      _router.goto(scope.row.type.route('add'));
    },

    onLogs() {
      _router.goto('/temp/admin/logs');
    },

    onControl() {
      _router.goto('/temp/control');
    },

    onScreen() {
      _router.goto('/temp/screen');
    },

  },

};
</script>

<style lang="sass">
.page-temp-admin

  &__content
    padding: 1em

  &__operations
    padding-bottom: 1em
</style>