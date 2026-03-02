<template lang="pug">
ZeroFormulate.entity-zui-form(form="form.generate.edit", :info="{ params }", @entity="onEntity", @submit="doClose", @abort="doClose")
  template(#top="{ schema, values }")
    EntityZUIButtons(v-if="values", :entity="values", :params="params")
  template(slot-scope="{ schema, values }")
    CustomPlugin(:type="['entity', 'form', params.entity_type]", v-model="values", :schema="schema", :params="params")
</template>

<script>
export default {

  props: ['entity_type', 'entity_id'],

  inject: ['zuiw'],

  computed: {

    params() {
      return {
        generate: 'entity.' + this.entity_type,
        entity_type: this.entity_type,
        id: this.entity_id,
      };
    },

  },

  methods: {

    async onEntity({ storage, entity }) {
      const labelKey = await storage.key('label');
      this.zuiw.setTitle(this.entity_type.toUpperCase() + ' / ' + entity[labelKey]);
    },

    doClose() {
      this.zuiw.close();
    },

  },

};
</script>

<style lang="sass">

</style>