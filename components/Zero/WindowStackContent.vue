<template lang="pug">
ZeroComponent(ref="comp", :comps="component.component", v-bind="component.params")
</template>

<script>
export default {

  props: ['component', 'index'],

  inject: ['ws'],

  provide() {
    return {
      wsc: this,
    };
  },

  methods: {

    parent() {
      return this.component.parent ? this.ws.getComponent(this.component.parent) : null;
    },

    close() {
      this.ws.closeComponent(this.component.key);
    },

    open(component, params = {}, info = {}) {
      this.ws.addComponent(component, params, info, this.component.key);
    },

  },

};
</script>
    