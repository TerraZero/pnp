<template lang="pug">
.custom-plugin-audio-provider-file
  CustomInputSongSelect(v-model="value.src", label="Source (src)")
</template>

<script>
export default {

  props: ['value'],

}
</script>

<style lang="sass">
.custom-plugin-entity-form-audio
  margin-top: .5em
</style>