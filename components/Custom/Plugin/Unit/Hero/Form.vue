<template lang="pug">
EditorToolSlot.custom-plugin-unit-hero-form(:label="value.name", group, closable, @item-change="onItemChange")
  template(#mark)
    slot
  EditorInputTextfield(v-model="value.name", label="Name")
  .std-grid-half
    EditorInputSelect(v-model="value.init", options="1-10", label="Initiative")
    EditorInputSelect(v-model="value.pos", options="1-15", label="Position")
  EditorInputSwitches(v-model="value.props", :options="{ show: 'Show', turn: 'Turn' }")
  EditorInputTextarea(v-model="value.description", label="Description")
  EditorToolSlot(label="Image", closable, @item-change="onItemChange")
    EditorInputImageSelect(v-model="value.img", prefix="/eldritch/", label="Image")
    EditorInputSlider(v-model="displayDefault.width", :min="0", :max="200", label="Width (vw)")
    EditorInputSwitches(v-model="displayDefault.props", :options="{ mirror: 'Mirror' }")
    EditorToolSlot(label="Avatar", closable, @item-change="onItemChange")
      EditorInputSlider(v-model="displayAvatar.width", :min="0", :max="100", label="Width (vw)")
      EditorInputSlider(v-model="displayAvatar.top", :min="-100", :max="100", label="Top (vh)")
      EditorInputSlider(v-model="displayAvatar.left", :min="-100", :max="100", label="Left (vw)")
      EditorInputSwitches(v-model="displayAvatar.props", :options="{ mirror: 'Mirror' }")
      EditorInputColor(v-model="displayAvatar.background")

</template>

<script>
import ComputedUtil from '~/custom/util/ComputedUtil';

export default {

  props: ['value'],

  computed: {

    displayDefault: ComputedUtil.getDeepProp('value', 'displays.default', {}, true),
    displayAvatar: ComputedUtil.getDeepProp('value', 'displays.avatar', {}, true),

  },

  methods: {

    onItemChange(...args) {
      this.$emit('item-change', ...args);
    },

  },

}
</script>