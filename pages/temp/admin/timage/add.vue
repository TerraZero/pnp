<template lang="pug">
.page-temp-admin-timage-add
  TempBreadcrumb(top)
    ElBreadcrumbItem(:to="{ path: '/temp/admin' }") Admin
    ElBreadcrumbItem(:to="{ path: route('base') }") {{ type_label }}
    ElBreadcrumbItem Add {{ type_label }}
  .page-temp-admin-timage-add__content
    h1 Add {{ type_label }}
    ElForm.page-temp-admin-timage-add__form
      .page-temp-admin-timage-add__operations
        EditorInputSwitch.page-temp-admin-timage-add__status(v-model="values.status", label="Status", border, :on="1", :off="0")
        ElButton(type="primary", @click="onSave") Save
        ElButton(type="danger", @click="onDelete") Delete
      .page-temp-admin-timage-add__grid
        .page-temp-admin-timage-add__fields
          EditorInputTextfield(v-model="values.label", label="Label")
          EditorInputTextfield(v-model="values.src", label="Source")
          EditorInputSlider(v-model="values.zoom", label="Zoom", :min="0", :max="5", :step="0.001", :track="false")
          EditorInputSlider(v-model="values.top", label="Top", :min="-100", :max="100", :step="0.1", :track="false")
          EditorInputSlider(v-model="values.left", label="Left", :min="-100", :max="100", :step="0.1", :track="false")
          EditorInputSlider(v-model="values.rotate", label="Rotate", :min="0", :max="360", :step="1", :track="false")
          EditorInputSelect(v-model="values.fit", label="Fit", :options="{ cover: 'Cover', contain: 'Contain' }")
        .page-temp-admin-timage-add__preview
          TempImage.page-temp-admin-timage-add__image(:src="values.src", frame="2em", :mutate="getValues(['top', 'left', 'zoom'])")
</template>

<script>
import TempEntityEdit from '~/custom/mixins/page/TempEntityEdit';

export default {

  mixins: [TempEntityEdit],

  computed: {

    params_type() {
      return 'timage';
    },

    params_create() {
      return true;
    },

  },

};
</script>

<style lang="sass">
.page-temp-admin-timage-add

  &__content
    padding: 1em

  &__form,
  &__fields
    display: grid
    gap: 1em
    align-items: start
    align-content: start

  &__operations
    padding: .5em
    border: 3px solid var(--color--ui-disabled)
    text-align: right
    background: var(--color--ui-grey-light)

  &__status
    margin-right: 1em !important
    padding: .8em

  &__grid
    display: grid
    grid-template-columns: 1fr 1fr
    gap: 1em

  &__image
    width: 100%
    aspect-ratio: 16/9

</style>