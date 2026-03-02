<template lang="pug">
.custom-plugin-entity-form-unit
  EditorInputEntitySelect(v-model="value.type", type="unit_type", label="Unit Type", :config="{no_edit: true}")
</template>

<script>
export default {

  props: ['value'],

}
</script>

<style lang="sass">
.custom-plugin-entity-form-unit
  margin-top: .5em
</style>