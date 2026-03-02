<template lang="pug">
.entity-zui-unit-type-attributes
  .entity-zui-unit-type-attributes__basic.entity-zui-unit-type-attributes__attributes
    .entity-zui-unit-type-attributes__attribute
      .entity-zui-unit-type-attributes__label Live
      EditorInputTextfield(v-model="entity.value.live.min", label="Min", size="mini")
      EditorInputTextfield(v-model="entity.value.live.max", label="Max", size="mini")
      EditorInputTextfield(v-model="entity.value.live.fix", label="Fix", size="mini")
    .entity-zui-unit-type-attributes__attribute
      .entity-zui-unit-type-attributes__label AC
      EditorInputTextfield(v-model="entity.value.ac.min", label="Min", size="mini")
      EditorInputTextfield(v-model="entity.value.ac.max", label="Max", size="mini")
      EditorInputTextfield(v-model="entity.value.ac.fix", label="Fix", size="mini")
    .entity-zui-unit-type-attributes__attribute
      .entity-zui-unit-type-attributes__label Leveln
      EditorInputTextfield(v-model="entity.value.leveln.live", label="Live", size="mini")
  .entity-zui-unit-type-attributes__attributes
    .entity-zui-unit-type-attributes__attribute(v-for="attribute, key in attributes", :key="key")
      .entity-zui-unit-type-attributes__label {{ attribute }}
      EditorInputTextfield(v-model="entity.value.attributes[key].min", label="Min", size="mini")
      EditorInputTextfield(v-model="entity.value.attributes[key].max", label="Max", size="mini")
      EditorInputTextfield(v-model="entity.value.attributes[key].fix", label="Fix", size="mini")
</template>

<script>
import ComputedUtil from '~/custom/util/ComputedUtil';

export default {

  props: ['entity'],

  created() {
    ComputedUtil.setDeepVueDefault(this.entity, 'value.live', {
      min: 0,
      max: 0,
      fix: 0,
    });
    ComputedUtil.setDeepVueDefault(this.entity, 'value.ac', {
      min: 0,
      max: 0,
      fix: 0,
    });
    ComputedUtil.setDeepVueDefault(this.entity, 'value.leveln', {
      live: 0,
    });
    for (const attribute in this.attributes) {
      ComputedUtil.setDeepVueDefault(this.entity, 'value.attributes.' + attribute, {
        min: 0,
        max: 0,
        fix: 0,
      });
    }
  },

  data() {
    return {
      attributes: {
        str: 'Strength',
        dex: 'Dexterity',
        con: 'Constitution',
        int: 'Intelligence',
        wis: 'Wisdom',
        cha: 'Charisma',
      },
    };
  },

};
</script>

<style lang="sass">
.entity-zui-unit-type-attributes
  display: grid
  grid-template-columns: 1fr
  gap: .5em

  &__attributes
    display: grid
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr))
    gap: .5em

  &__attribute
    display: grid
    grid-template-columns: repeat(3, 1fr)
    gap: .25em

  &__label
    grid-column: 3 span
    background: rgba(255, 255, 255, .2)
    padding: .2em
</style>