<template lang="pug">
.custom-plugin-entity-form-image
  CustomInputImageSelect(v-model="value.src", label="Source (src)")
  ZUILoadingPane(:params="[value.src]", :method="loadingtest")
    template(#default="{ params, result }")
      | {{ params[0] }}
      code {{ result }}
</template>

<script>
export default {

  props: ['value'],

  methods: {

    loadingtest: function(...params) {
      return new Promise(function(res) {
        setTimeout(() => {
          res({
            params,
          });
        }, 2000);
      });
    },

  },

}
</script>

<style lang="sass">
.custom-plugin-entity-form-image
  margin-top: .5em
</style>