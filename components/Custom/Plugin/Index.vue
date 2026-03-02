<template lang="pug">
ZeroComponent.custom-plugin(v-if="comp", :comps="comp", v-bind="$attrs", v-on="$listeners")
  template(v-for="(_, slotName) in $slots" v-slot:[slotName])
    slot(:name="slotName")
  template(v-for="(_, slotName) in $scopedSlots" v-slot:[slotName])
    slot(:name="slotName")
</template>

<script>
import StringUtil from 'zero-util/src/StringUtil';

export default {

  props: ['type'],

  computed: {

    comp() {
      let comp = null;
      if (typeof this.type === 'string' && this.type) {
        comp = 'CustomPlugin' + StringUtil.ucFirst(this.type);
      } else if (Array.isArray(this.type) && this.type.length) {
        comp = 'CustomPlugin' + this.type.map(v => StringUtil.ucFirst(v)).join('').split('_').map(v => StringUtil.ucFirst(v)).join('');
      }
      return comp;
    },

  },

}
</script>