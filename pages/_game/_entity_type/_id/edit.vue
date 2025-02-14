<template lang="pug">
.edit
  ZeroFormulate(form="form.generate.edit", :info="{ params }")
  pre {{ route }}
</template>

<script>
const RemoteSystem = require('zero-system/src/RemoteSystem');

export default {

  async asyncData({ params }) {
    params.generate = 'entity.' + params.entity_type;
    return { params };
  },

  mounted() {
    this.update();
  },

  data() {
    return {
      route: '',
    };
  },

  methods: {

    async update() {
      const entity = await RemoteSystem.get('entity.' + this.params.entity_type);
      
      this.route = await entity.route('edit', await entity.load(parseInt(this.params.id)));
    },

  },

}
</script>