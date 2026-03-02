<template lang="pug">
.page-temp-admin-tslideshow-add
  TempBreadcrumb(top)
    ElBreadcrumbItem(:to="{ path: '/temp/admin' }") Admin
    ElBreadcrumbItem(:to="{ path: route('base') }") {{ type_label }}
    ElBreadcrumbItem Add {{ type_label }}
  .page-temp-admin-tslideshow-add__content
    h1 Add {{ type_label }}
    ElForm.page-temp-admin-tslideshow-add__form
      .page-temp-admin-tslideshow-add__operations
        EditorInputSwitch.page-temp-admin-tslideshow-add__status(v-model="values.status", label="Status", border, :on="1", :off="0")
        ElButton(type="primary", @click="onSave") Save
        ElButton(type="danger", @click="onDelete") Delete
      EditorInputTextfield(v-model="values.label", label="Label")
      TempTagsInput(v-model="values.tags", label="Tags", :options="{battle: 'Battle'}")
      .page-temp-admin-tslideshow-add__images
        ElTable.page-temp-admin-tslideshow-add__table(:data="imagesData")
          ElTableColumn(prop="id", label="ID")
          ElTableColumn(prop="label", label="Name")
          ElTableColumn(label="Operations")
            template(#header)
              .page-temp-admin-tslideshow-add__images-operations
                | Operations
                .page-temp-admin-tslideshow-add__buttons
                  ElButton(type="primary", size="small", @click="$refs.image_dialog.open()") Add
            template(slot-scope="scope")
              ElButton(type="primary", size="small", icon="el-icon-edit", @click="onEdit(scope.row.image)") Edit
              ElButton(type="danger", size="small", icon="el-icon-document-delete", @click="onRemove('images', scope.row.image)") Remove
              ElButton(size="small", icon="el-icon-document-delete", @click="onItem(scope.$index)") >>
        .page-temp-admin-tslideshow-add__image-form(v-if="selected_index !== -1")
          h2.page-temp-admin-tslideshow-add__image-label Edit {{ selectedImage?.label() }}
          .page-temp-admin-tslideshow-add__image-wrapper
            EditorInputTextfield(v-model="selectedImageMeta.time", label="Time")
    TempEntitySelect(v-if="images_type", :entity_type="images_type", :excludes="images_ids", ref="image_dialog", @submit="onImageSubmit")
</template>

<script>
import TempEntityEdit from '~/custom/mixins/page/TempEntityEdit';

export default {

  mixins: [TempEntityEdit],

  data() {
    return {
      images: [],
      images_type: null,
      selected_index: -1,
    };
  },  

  computed: {

    params_type() {
      return 'tslideshow';
    },

    params_create() {
      return true;
    },

    imagesData() {
      const rows = [];

      for (const image of this.images) {
        rows.push({
          id: image.id(),
          label: image.data.label,
          image,
        });
      }
      return rows;
    },

    images_ids() {
      return this.images.map(v => v.id());
    },

    selectedImage() {
      return this.images[this.selected_index];
    },

    selectedImageMeta() {
      return this.values.value?.meta_images[this.selected_index] ?? {};
    },

  },

  methods: {

    async prepare() {
      this.images_type ??= await this.entity.getRefType('images');
      this.images = await this.entity.getRef('images');
      if (this.values.value.meta_images === undefined) {
        this.$set(this.values.value, 'meta_images', []);
      }
      for (const index in this.images) {
        if (this.values.value.meta_images.length <= index) {
          this.values.value.meta_images.push({
            time: 5000,
          });
        }
      }
    },

    /**
     * @param {import('~/custom/server/temp/src/TempEntity')} entity 
     */
    async onEdit(entity) {
      await entity.goto('edit');
    },

    /**
     * @param {string} field 
     * @param {import('~/custom/server/temp/src/TempEntity')} entity 
     */
    onRemove(field, entity) {
      const index = this.entity.findRef(field, entity);
      this.entity.delRef(field, null, entity);
      this.values.value.meta_images.splice(index, 1);
      this.prepare();
    },

    onItem(index) {
      this.selected_index = index;
    },

    onImageSubmit(items) {
      for (const item of items) {
        this.entity.setRef('images', null, item);
      }
      this.prepare();
    },

  },

};
</script>

<style lang="sass">
.page-temp-admin-tslideshow-add

  &__content
    padding: 1em

  &__form,
  &__image-wrapper
    display: grid
    grid-template-columns: 1fr
    gap: 1em

  &__image-wrapper
    padding: .5em

  &__operations
    padding: .5em
    border: 3px solid var(--color--ui-disabled)
    text-align: right
    background: var(--color--ui-grey-light)

  &__status
    margin-right: 1em !important
    padding: .8em

  &__images-operations
    display: flex
    justify-content: space-between
    align-items: center

  &__images
    display: grid
    grid-template-columns: 1fr 2fr
    gap: .5em

  &__image-form
    border-bottom: 1px solid var(--color--background)
    background-color: var(--color--main) !important

  &__image-label
    background-color: var(--color--side) !important
    padding: 1em
    margin: 0

  &__table
    background-color: var(--color--main) !important

</style>