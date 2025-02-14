<template lang="pug">
ZeroFormulate(form="form.generate.edit", :info="{ params }")
</template>

<script>
export default {

  async asyncData({ params }) {
    params.generate = 'entity.' + params.entity_type;
    return { params };
  },

}
</script>