<template lang="pug">
  ElButton(type="submit", @click.prevent="onClick", :disabled="context.disabled") {{ context.label || 'Submit' }}
</template>

<script>
export default {

  props: {

    context: {
      type: Object,
      required: true,
    },

  },

  methods: {

    onClick() {
      if (this.context.attributes['@action']) {
        this.context.attributes['@action'](this.context.name);
      }
    },

  },

};
</script>

<style scoped>

</style>