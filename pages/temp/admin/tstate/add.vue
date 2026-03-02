<template lang="pug">
.page-temp-admin-tstate-add
  TempBreadcrumb(top)
    ElBreadcrumbItem(:to="{ path: '/temp/admin' }") Admin
    ElBreadcrumbItem(:to="{ path: route('base') }") {{ type_label }}
    ElBreadcrumbItem Add {{ type_label }}
  .page-temp-admin-tstate-add__content
    h1 Add {{ type_label }}
    ElForm.page-temp-admin-tstate-add__form
      .page-temp-admin-tstate-add__operations
        EditorInputSwitch.page-temp-admin-tstate-add__status(v-model="values.status", label="Status", border, :on="1", :off="0")
        ElButton(type="primary", @click="onSave") Save
        ElButton(type="danger", @click="onDelete") Delete
      EditorInputTextfield(v-model="values.label", label="Label")
      EditorInputFrame(ref="value_frame", label="Value")
        template(#header)
          TempBreadcrumbButton(icon="finished", @click="onValueReset")
        EditorInputTextarea(v-model="value_proxy", @input="onValueInput")
</template>

<script>
import TempEntityEdit from '~/custom/mixins/page/TempEntityEdit';

export default {

  mixins: [TempEntityEdit],

  data() {
    return {
      value_proxy: '',
    };
  },  

  computed: {

    params_type() {
      return 'tstate';
    },

    params_create() {
      return true;
    },

    value_text() {
      return JSON.stringify(this.values.value, null, 2);
    },  

  },

  methods: {

    prepare() {
      this.value_proxy = JSON.stringify(this.values.value, null, 2);
    },

    onValueInput(input) {
      try {
        const object = JSON.parse(input);
        this.values.value = object;
        this.value_proxy = JSON.stringify(this.values.value, null, 2);
        this.$refs.value_frame.setState('success', 'Valid');
      } catch (e) {
        this.$refs.value_frame.setState('error', e.message);
      }
    },

    onValueReset() {
      this.value_proxy = JSON.stringify(this.values.value, null, 2);
      this.$refs.value_frame.setState('success', 'Reset to last valid json.');
    },

  },

};
</script>

<style lang="sass">
.page-temp-admin-tstate-add

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