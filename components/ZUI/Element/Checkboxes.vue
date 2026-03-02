<template lang="pug">
.zui-element-checkboxes
  .zui-element-checkboxes__checkbox(v-for="option, index in options", :key="index")
    label.zui-element-checkboxes__label(:for="uuid + '--' + index") {{ option }}
    input.zui-element-checkboxes__input(type="checkbox", :id="uuid + '--' + index", :checked="value.includes(index)", @input="onInput($event, index)")
</template>

<script>
import { v4 } from 'uuid';

export default {

  props: ['value', 'options'],

  data() {
    return {
      uuid: v4(),
    };
  },

  methods: {

    onInput(event, index) {
      const data = JSON.parse(JSON.stringify(this.value ?? []));
      if (event.target.checked && !data.includes(index)) {
        data.push(index); 
      } else if (!event.target.checked && data.includes(index)) {
        data.splice(data.indexOf(index), 1);
      }
      this.$emit('input', data);
    },

  },

}
</script>

<style lang="sass">
.zui-element-checkboxes

  &__checkbox
    display: grid
    grid-template-columns: 1fr min-content
    padding: .2em .5em

    & + &
      border-top: 2px solid white

  &__checkbox:hover
    background: rgba(255, 255, 255, .2)

  &__label
    cursor: pointer
  
</style>