<template lang="pug">
.editor-tool-slot(:class="classes")
  .editor-tool-slot__label(@click="onClick")
    EditorToolLabel(:label="label", headline)
    .editor-tool-slot__mark
      .editor-tool-slot__mark-slot(v-if="$slots.mark", @click.stop)
        slot(name="mark")
      .editor-tool-slot__warn.el-icon-warning(v-if="isWarn")
    ElSwitch.editor-tool-slot__switch(v-if="closable !== undefined", v-model="realOpen", active-color="#00bdb5")
  EditorEffectCollapse.editor-tool-slot__content(:visible="realOpen")
    .editor-tool-slot__wrapper
      slot
</template>

<script>
export default {

  provide() {
    return {
      eslot: this,
    };
  },

  props: ['label', 'headline', 'closable', 'open', 'group'],

  watch: {

    open(value) {
      this.realOpen = value;
    },

    realOpen(value) {
      this.$emit('update:open', value);
    },

  },

  data() {
    const data = {
      realOpen: this.open ?? false,
      realWarn: {},
    };
    if (this.closable === undefined) {
      data.realOpen = true;
    }
    return data;
  },

  computed: {

    classes() {
      const classes = [];

      if (this.closable !== undefined) classes.push('closable');
      if (this.group !== undefined) classes.push('group');
      return classes.map(v => 'editor-tool-slot--' + v);
    },

    isWarn() {
      for (const key in this.realWarn) {
        if (this.realWarn[key]) return true;
      }
      return false;
    },

  },

  methods: {

    onClick() {
      if (this.closable === undefined) return;
      this.realOpen = !this.realOpen;
      this.$emit('opened', this);
    },

    onItemChange(item, value) {
      this.$emit('item-change', { item, value });
    },

    warn(track, state = true) {
      this.$set(this.realWarn, track, state);
    },

  },

}
</script>

<style lang="sass">
.editor-tool-slot
  background: #212121
  color: white
  border: 2px solid #181818

  & &
    background: #303030

  &__label
    display: grid
    background: #414141
    padding: .5em 1em
    grid-template-columns: max-content 1fr
    gap: .5em
    align-items: center

  &--closable &__label
    grid-template-columns: max-content 1fr min-content
    cursor: pointer
    transition: background .2s ease-in-out

  &--closable &__label:hover
    background: #515151

  &__wrapper
    padding: .5em 1em
    border-top: 2px solid #181818

  &__switch
    pointer-events: none

  &__mark
    display: grid
    grid-template-columns: max-content max-content
    justify-content: right

  &__warn
    vertical-align: middle
    font-size: 1.2em
    color: var(--warning)

  &--group &__wrapper
    display: grid
    grid-template-columns: 1fr
    gap: var(--editor-tool-slot--gap, 1em)
</style>