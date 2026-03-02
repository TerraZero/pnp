<template lang="pug">
.page-temp-admin-tplaylist
  TempBreadcrumb(top)
    ElBreadcrumbItem(:to="{ path: '/temp/admin' }") Admin
    ElBreadcrumbItem {{ type_label }}
  .page-temp-admin-tplaylist__content
    h1 {{ type_label }}
    .page-temp-admin-tplaylist__operations
      ElButton(type="primary", icon="el-icon-document-add", @click="onAdd") Add {{ type_label }}
    ElTable.page-temp-admin-tplaylist__types(:data="result")
      ElTableColumn(prop="id", label="ID")
      ElTableColumn(prop="label", label="Name")
      ElTableColumn(label="Operations")
        template(slot-scope="scope")
          ElButton(type="primary", size="small", icon="el-icon-edit", @click="onEdit(scope)") Edit
          ElButton(type="danger", size="small", icon="el-icon-document-delete", @click="onDelete(scope)") Delete
</template>

<script>
import TempEntityBase from '~/custom/mixins/page/TempEntityBase';

export default {

  mixins: [TempEntityBase],

  computed: {

    params_type() {
      return 'tplaylist';
    },

  },

};
</script>

<style lang="sass">
.page-temp-admin-tplaylist

  &__content
    padding: 1em

  &__operations
    padding-bottom: 1em
</style>