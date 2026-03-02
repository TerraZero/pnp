<template lang="pug">
ZeroFormulate(form="form.generate.edit", :info="{ params }")
  template(#top="{ schema, values }")
    EntityZUIButtons(v-if="values", :entity="values", :params="params")
  template(slot-scope="{ schema, values }")
    CustomPlugin(:type="['entity', 'form', params.entity_type]", v-model="values", :schema="schema", :params="params")
</template>

<script>
export default {

  async asyncData({ params }) {
    params.generate = 'entity.' + params.entity_type;
    return { params };
  },

}
</script>