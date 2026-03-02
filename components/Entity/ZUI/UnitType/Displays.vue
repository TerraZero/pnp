<template lang="pug">
.entity-zui-unit-displays
  EditorInputMultiSwitch.entity-zui-unit-displays__item(v-model="select", :buttons="options", :actions="['add', 'delete']", @action="onAction")
  CustomInputImageSelect(v-model="entity.value.displays[select].img", label="Image", size="mini")
  EditorInputSlider(v-model="entity.value.displays[select].width", :min="0", :max="200", label="Width (vw)")
  EditorInputSlider(v-model="entity.value.displays[select].top", :min="-100", :max="100", label="Top (vh)")
  EditorInputSlider(v-model="entity.value.displays[select].left", :min="-100", :max="100", label="Left (vw)")
  EditorInputSwitches(v-model="entity.value.displays[select].props", :options="{ mirror: 'Mirror' }")
</template>

<script>
import ComputedUtil from '~/custom/util/ComputedUtil';

export default {

  props: ['entity', 'display'],

  created() {
    ComputedUtil.setDeepVueDefault(this.entity, 'value.displays.default.props');
  },

  data() {
    return {
      select: this.display ?? 'default',
    };
  },

  computed: {

    options() {
      const options = [];

      for (const display in this.entity.value.displays) {
        options.push({ key: display, label: display });
      }
      return options;
    },

  },

  methods: {

    onAction({ action, input }) {
      if (action === 'add') { 
        ComputedUtil.setDeepVueDefault(this.entity, 'value.displays.' + input + '.props');
        this.select = input;
      } else if (action === 'delete') {
        for (const display in this.entity.value.displays) {
          if (display === input) continue;
          this.select = display;
          break;
        }
        this.$delete(this.entity.value.displays, input);
      }
    },

  },

};
</script>

<style lang="sass">
.entity-zui-unit-displays
  display: grid
  grid-template-columns: 1fr
  gap: .5em
</style>