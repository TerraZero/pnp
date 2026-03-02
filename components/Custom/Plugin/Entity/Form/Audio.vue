<template lang="pug">
.custom-plugin-entity-form-audio
  ElSelect(v-model="value.provider")
    ElOption(value="none", label="< None >")
    ElOption(value="file", label="File")
  CustomPlugin(v-if="value.provider && value.provider !== 'none'", :type="['AudioProvider', value.provider]", v-model="value", :schema="schema", :params="params")
</template>

<script>
export default {

  props: ['value', 'schema'],

}
</script>

<style lang="sass">
.custom-plugin-entity-form-audio
  margin-top: .5em
</style>