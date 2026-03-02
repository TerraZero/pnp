<template lang="pug">
ElTabPane.editor-tool-tab(:name="name", :label="label")
  slot
</template>

<script>
export default {

  props: ['name', 'label'],

}
</script>

<style lang="sass">
.editor-tool-tab
  padding: 0

</style>