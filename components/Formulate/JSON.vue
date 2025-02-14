<template lang="pug">
.formulate-autocomplete.formulate-input-element(:data-type="context.type")
  json-editor-vue(v-model="context.model")
</template>

<script>
export default {

  props: {

    context: {
      type: Object,
      required: true,
    },

  },

  mounted() {
    console.log(this.context.model);
  },

}
</script>

<style lang="sass">

</style>
