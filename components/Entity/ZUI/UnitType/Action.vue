<template lang="pug">
.entity-zui-unit-action
  EditorInputTextfield(v-model="entity.value.actions[index].label", label="Label", size="mini")
  EditorInputTextarea(v-model="entity.value.actions[index].text", label="Description", size="mini")
  EditorInputTextfield(v-model="entity.value.actions[index].range", label="Range", size="mini")
  EditorInputTextfield(v-model="entity.value.actions[index].damage", label="Damage", size="mini")
  EditorInputTextfield(v-model="entity.value.actions[index].bonus", label="Bonus", size="mini")
  EditorInputTextfield(v-model="entity.value.actions[index].level", label="Level", size="mini")
  EditorInputSelect(v-model="entity.value.actions[index].attr", :options="options", label="Attribute", size="mini")
</template>

<script>
export default {

  props: ['entity', 'index'],

  computed: {

    options() {
      const options = {};
      if (this.entity?.value?.attributes) {
        for (const attribute in this.entity.value.attributes) {
          options[attribute] = attribute + ' [' + this.entity.value.attributes[attribute].fix + '] [' + this.entity.value.attributes[attribute].min + '/' + this.entity.value.attributes[attribute].max + ']';
        }
      }
      return options;
    },

  },

};
</script>

<style lang="sass">
.entity-zui-unit-action
  display: grid
  grid-template-columns: 1fr
  gap: .5em
</style>