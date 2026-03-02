<template lang="pug">
.editor-view-pill-grid
  slot  
</template>

<script>
export default {

  

}
</script>

<style lang="sass">
.editor-view-pill-grid
  display: grid
  grid-template-columns: repeat(auto-fill, minmax(50px, 1fr))
  gap: 1em

</style>