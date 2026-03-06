<template lang="pug">
.page-temp-admin-tmusic
  TempBreadcrumb(top)
    ElBreadcrumbItem(:to="{ path: '/temp/admin' }") Admin
    ElBreadcrumbItem {{ type_label }}
  .page-temp-admin-tmusic__content
    h1 {{ type_label }}
    .page-temp-admin-tmusic__operations
      ElButton(type="primary", icon="el-icon-document-add", @click="onAdd") Add {{ type_label }}
    ElTable.page-temp-admin-tmusic__types(:data="result")
      ElTableColumn(prop="id", label="ID")
      ElTableColumn(prop="label", label="Name")
      ElTableColumn(prop="channel", label="Channel")
      ElTableColumn(prop="playlist", label="Playlist")
        template(slot-scope="{ row }")
          .page-temp-admin-tmusic__playlist(v-if="row.playlist") 
            ElButton(type="primary", size="small", icon="el-icon-edit", circle, @click="onPlaylistEdit(row.playlist)")
            | {{ row.playlist.label() }} <strong>({{ row.playlist.id() }})</strong>
          .page-temp-admin-tmusic__playlist(v-else) - NO -
      ElTableColumn(prop="tags", label="Tags")
        template(slot-scope="{ row }")
          TempTagsOutput(:value="row.tags", hide-cat)
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
      return 'tmusic';
    },

  },

  methods: {

    async prepareList(list) {
      for (const index in list.entities) {
        list.result[index].playlist = await list.entities[index].getRef('playlists', 0);
      }
    },

    onPlaylistEdit(playlist) {
      playlist.goto('edit');
    },

  },

};
</script>

<style lang="sass">
.page-temp-admin-tmusic

  &__content
    padding: 1em

  &__operations
    padding-bottom: 1em

  &__playlist
    display: flex
    gap: .5em
    align-items: center
</style>