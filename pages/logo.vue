<template lang="pug">
ZeroLogo(ref="logo", :total="200", :current="200", @click.native="onClick")
</template>

<script>
export default {

  methods: {

    onClick() { 
      this.$refs.logo.complete(1000);
    },

  },

}
</script>

<style lang="sass">

</style>