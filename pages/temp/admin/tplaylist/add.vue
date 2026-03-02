<template lang="pug">
.page-temp-admin-tplaylist-add
  TempBreadcrumb(top)
    ElBreadcrumbItem(:to="{ path: '/temp/admin' }") Admin
    ElBreadcrumbItem(:to="{ path: route('base') }") {{ type_label }}
    ElBreadcrumbItem Add {{ type_label }}
  .page-temp-admin-tplaylist-add__content
    h1 Add {{ type_label }}
    ElForm.page-temp-admin-tplaylist-add__form
      .page-temp-admin-tplaylist-add__operations
        EditorInputSwitch.page-temp-admin-tplaylist-add__status(v-model="values.status", label="Status", border, :on="1", :off="0")
        ElButton(type="primary", @click="onSave") Save
        ElButton(type="danger", @click="onDelete") Delete
      EditorInputTextfield(v-model="values.label", label="Label")
      ElTable(:data="musicsData")
        ElTableColumn(prop="id", label="ID")
        ElTableColumn(prop="label", label="Name")
        ElTableColumn(label="Operations")
          template(#header)
            .page-temp-admin-tplaylist-add__musics-operations
              | Operations
              .page-temp-admin-tplaylist-add__buttons
                ElButton(type="primary", size="small", @click="$refs.music_dialog.open()") Add
          template(slot-scope="scope")
            ElButton(type="primary", size="small", icon="el-icon-edit", @click="onEdit(scope.row.music)") Edit
            ElButton(type="danger", size="small", icon="el-icon-document-delete", @click="onRemove('musics', scope.row.music)") Remove
    TempEntitySelect(v-if="musics_type", :entity_type="musics_type", :excludes="musics_ids", ref="music_dialog", @submit="onMusicSubmit")
</template>

<script>
import TempEntityEdit from '~/custom/mixins/page/TempEntityEdit';

export default {

  mixins: [TempEntityEdit],

  data() {
    return {
      musics: [],
      musics_type: null,
    };
  },  

  computed: {

    params_type() {
      return 'tplaylist';
    },

    params_create() {
      return true;
    },

    musicsData() {
      const rows = [];

      for (const music of this.musics) {
        rows.push({
          id: music.id(),
          label: music.data.label,
          music,
        });
      }
      return rows;
    },

    musics_ids() {
      return this.musics.map(v => v.id());
    },

  },

  methods: {

    async prepare() {
      this.musics_type ??= await this.entity.getRefType('musics');
      this.musics = await this.entity.getRef('musics');
    },

    /**
     * @param {import('~/custom/server/temp/src/TempEntity')} entity 
     */
    onEdit(entity) {
      entity.goto('edit');
    },

    onRemove(field, entity) {
      this.entity.delRef(field, null, entity);
      this.prepare();
    },

    onMusicSubmit(items) {
      for (const item of items) {
        this.entity.setRef('musics', null, item);
      }
      this.prepare();
    },

  },

};
</script>

<style lang="sass">
.page-temp-admin-tplaylist-add

  &__content
    padding: 1em

  &__form
    display: grid
    grid-template-columns: 1fr
    gap: 1em

  &__operations
    padding: .5em
    border: 3px solid var(--color--ui-disabled)
    text-align: right
    background: var(--color--ui-grey-light)

  &__status
    margin-right: 1em !important
    padding: .8em

  &__musics-operations
    display: flex
    justify-content: space-between
    align-items: center

</style>