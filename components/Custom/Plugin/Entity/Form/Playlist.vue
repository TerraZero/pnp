<template lang="pug">
.custom-plugin-entity-form-playlist
  CustomInputEntitySelect(v-model="value.playlist", :fields="{'id': 'ID', 'name': 'Name'}", type="audio", label="Playlist", :config="{no_edit: true}")
</template>

<script>
export default {

  props: ['value'],

}
</script>

<style lang="sass">
.custom-plugin-entity-form-playlist
  margin-top: .5em
</style>