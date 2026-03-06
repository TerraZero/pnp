<template lang="pug">
.page-temp-admin-ttag-add
  TempBreadcrumb(top)
    ElBreadcrumbItem(:to="{ path: '/temp/admin' }") Admin
    ElBreadcrumbItem(:to="{ path: route('base') }") {{ type_label }}
    ElBreadcrumbItem Add {{ type_label }}
  .page-temp-admin-ttag-add__content
    h1 Add {{ type_label }}
    ElForm.page-temp-admin-ttag-add__form
      .page-temp-admin-ttag-add__operations
        ElButton(type="primary", @click="onSave") Save
        ElButton(type="danger", @click="onDelete") Delete
      EditorInputSelect(v-model="values.cat", label="Category", :options="categories", allow-create, filterable)
      EditorInputTextfield(v-model="values.label", label="Label")
</template>

<script>
import TempEntityEdit from '~/custom/mixins/page/TempEntityEdit';
import RemoteSystem from 'zero-system/src/RemoteSystem';
import Util from '~/custom/server/Util';

export default {

  mixins: [TempEntityEdit],

  async mounted() {
    /** @type {import('~/custom/server/temp/Service/Temp.service')} */
    const temp = await RemoteSystem.get('service.temp');
    
    this.categories = Util.mapObject(await temp.getTagCategories(), (k, v) => [v, v]);
  },

  data() {
    return {
      value_proxy: '',
      categories: {},
    };
  },  

  computed: {

    params_type() {
      return 'ttag';
    },

    params_create() {
      return true;
    }, 

  },

};
</script>

<style lang="sass">
.page-temp-admin-ttag-add

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

</style>