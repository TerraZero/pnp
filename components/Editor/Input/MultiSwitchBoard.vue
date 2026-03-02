<template lang="pug">
.editor-input-multi-switch-board(:class="classes")
  .editor-input-multi-switch-board__label(@click="onOpen")
    slot
  EditorEffectCollapse.editor-input-multi-switch-board__checkboxes(:visible="realOpen")
    .editor-input-multi-switch-board__switch(v-for="label, key in checkboxes", :key="key")
      .editor-input-multi-switch-board__name {{ label }}
      ElSwitch.editor-input-multi-switch-board__input(:value="values[key]", @input="onInput(key, $event)", active-color="#00bdb5")
</template>

<script>
import JSONUtil from 'zero-util/src/JSONUtil';

export default {

  props: ['value', 'checkboxes', 'grid', 'open', 'mount'],

  watch: {

    open: {
      handler(value) {
        this.realOpen = value;
      },
      immediate: true,
    },

  },

  data() {
    return {
      realOpen: false,
    };
  },

  computed: {

    classes() {
      const classes = [];

      if (this.realOpen) classes.push('open');
      return classes.map(v => 'editor-input-multi-switch-board--' + v);
    },

    values() {
      return JSONUtil.getDeep(this.value, this.mount, {});
    },

  },

  methods: {

    onOpen() {
      this.realOpen = !this.realOpen;
      this.$emit('update:open', this.realOpen);
    },

    onInput(key, value) {
      const data = JSON.parse(JSON.stringify(this.value));
      const deep = JSONUtil.getDeep(data, this.mount, {});
      deep[key] = value;
      JSONUtil.setDeep(data, this.mount, deep);
      this.$emit('input', data);
    },

  },

}
</script>

<style lang="sass">
.editor-input-multi-switch-board

  &__label
    border: 1px solid white
    border-radius: 2px
    padding: .6em .8em
    background: #303030
    box-sizing: border-box
    cursor: pointer

  &--open &__label
    border-color: #00bdb5

  &__checkboxes
    display: grid
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr))

  &__switch 
    display: grid
    grid-template-columns: max-content 1fr
    gap: .5em
    padding: .5em

  &__checkboxes
    background: #181818
    border: 1px solid white
    border-radius: 2px
    box-sizing: border-box
    border-top: 0

  &__name
    vertical-align: center

</style>