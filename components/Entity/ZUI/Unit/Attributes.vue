<template lang="pug">
.entity-zui-unit-attributes
  .entity-zui-unit-attributes__basic.entity-zui-unit-attributes__attributes
    .entity-zui-unit-attributes__attribute(v-if="entity?.value?.live")
      .entity-zui-unit-attributes__label Live
      EditorInputTextfield(v-model="entity.value.live.value", label="Value", size="mini")
      EditorInputTextfield(v-model="entity.value.live.current", label="Current", size="mini")
    .entity-zui-unit-attributes__attribute(v-if="entity?.value?.ac")
      .entity-zui-unit-attributes__label AC
      EditorInputTextfield(v-model="entity.value.ac.value", label="Value", size="mini")
      EditorInputTextfield(v-model="entity.value.ac.modifier", label="Modifier", size="mini")
  .entity-zui-unit-attributes__attributes(v-if="entity?.value?.attributes")
    .entity-zui-unit-attributes__attribute(v-for="attribute, key in attributes", :key="key")
      .entity-zui-unit-attributes__label {{ attribute }}
      EditorInputTextfield(v-model="entity.value.attributes[key].value", label="Value", size="mini")
      EditorInputTextfield(v-model="entity.value.attributes[key].modifier", label="Modifier", size="mini")
      EditorInputTextfield(v-model="entity.value.attributes[key].current", label="Current", size="mini")
</template>

<script>
import ComputedUtil from '~/custom/util/ComputedUtil';
import RemoteSystem from 'zero-system/src/RemoteSystem';
import RandomUtil from '~/custom/util/RandomUtil';

/** @type {import('~/custom/server/entity/src/ContentEntityBase')} */
let _storage = null;

export default {

  props: ['entity'],

  async created() {
    _storage ??= await RemoteSystem.get('entity.unit_type');
    this.type = await _storage.load(this.entity.type);

    ComputedUtil.setDeepVueDefault(this.entity, 'value.live', () => {
      const value = this.getAttributeValue(this.type.value.live);
      return {
        value: value,
        current: value,
      };
    });
    ComputedUtil.setDeepVueDefault(this.entity, 'value.ac', () => {
      const value = this.getAttributeValue(this.type.value.ac);
      return {
        value: value,
        modifier: 0,
      };
    });
    for (const attribute in this.attributes) {
      ComputedUtil.setDeepVueDefault(this.entity, 'value.attributes.' + attribute, () => {
        const value = this.getAttributeValue(this.type.value.attributes[attribute]);
        return {
          value: value,
          modifier: 0,
          current: value,
        };
      });
    }
  },

  data() {
    return {
      type: null,
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

  methods: {

    getAttributeValue(attribute) {
      if (attribute.fix > 0) {
        return attribute.fix;
      } else {
        return RandomUtil.getRandomInt(attribute.min, attribute.max);
      }
    },

  },

};
</script>

<style lang="sass">
.entity-zui-unit-attributes
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