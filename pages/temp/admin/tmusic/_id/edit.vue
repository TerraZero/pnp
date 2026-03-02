<template lang="pug">
.page-temp-admin-tmusic-edit
  TempBreadcrumb(top)
    ElBreadcrumbItem(:to="{ path: '/temp/admin' }") Admin
    ElBreadcrumbItem(:to="{ path: route('base') }") {{ type_label }}
    ElBreadcrumbItem Edit {{ type_label }}
  .page-temp-admin-tmusic-edit__content
    h1 Edit {{ type_label }}
    ElForm.page-temp-admin-tmusic-edit__form
      .page-temp-admin-tmusic-edit__operations
        EditorInputSwitch.page-temp-admin-tmusic-edit__status(v-model="values.status", label="Status", border, :on="1", :off="0")
        ElButton(type="primary", @click="onSave") Save
        ElButton(type="danger", @click="onDelete") Delete
      EditorInputTextfield(v-model="values.label", label="Label")
      EditorInputSelect(v-model="values.type", label="Type", :options="{youtube: 'Youtube'}")
      EditorInputTextfield(v-model="values.src", label="Source")
      EditorInputSelect(v-model="values.channel", label="Channel", :options="{music: 'Music', sound: 'Sound'}")
      TempTagsInput(v-model="values.tags", label="Tags", :options="{battle: 'Battle'}")
      EditorInputTextfield(v-model="values.start", label="Start")
      EditorInputTextfield(v-model="values.end", label="End")
      EditorInputSlider(v-model="values.volume", label="Volume", :min="0", :max="1", :step="0.01", :track="false")
</template>

<script>
import TempEntityEdit from '~/custom/mixins/page/TempEntityEdit';

export default {

  mixins: [TempEntityEdit],

  computed: {

    params_type() {
      return 'tmusic';
    },

  },

};
</script>

<style lang="sass">
.page-temp-admin-tmusic-edit

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