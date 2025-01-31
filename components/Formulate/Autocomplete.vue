<template lang="pug">
.formulate-autocomplete.formulate-input-element(:class="classes", :data-type="context.type")
  input(type="text", v-model="context.model", v-bind="context.attributes", autocomplete="no", @keydown="onKeydown", @keydown.enter.prevent="onEnter", @keydown.down.prevent="increment", @keydown.up.prevent="decrement", @blur="onBlur", @focus="onFocus")
  ul.formulate-input-dropdown.formulate-autocomplete__dropdown(v-if="show")
    li(v-for="(option, index) in filteredOptions", :key="option.value", :class="getItemClass(index)", @mouseenter="selectedIndex = index", @click="onSelect", v-text="option.label")
</template>

<script>
export default {

  props: {

    context: {
      type: Object,
      required: true,
    },

  },

  data () {
    return {
      selectedIndex: 0,
      options: [],
      show: false,
    };
  },

  watch: {

    model () {
      this.selectedIndex = 0;
    },

  },

  computed: {

    classes() {
      const classes = [];

      classes.push('formulate-input-element--' + this.context.class);
      return classes;
    },

    model () {
      return this.context.model;
    },

    selection () {
      if (this.filteredOptions[this.selectedIndex]) {
        return this.filteredOptions[this.selectedIndex];
      }
      return false;
    },

    filteredOptions () {
      if (Array.isArray(this.context.options) && this.context.model) {
        const isAlreadySelected = this.context.options.find(option => option.label === this.context.model);
        if (!isAlreadySelected) {
          return this.context.options
            .filter(option => option.label.toLowerCase().includes(this.context.model.toLowerCase()));
        }
      } else if (this.options.length) {
        return this.options
            .filter(option => (this.getKey(option) + '' + this.getLabel(option)).toLowerCase().includes(this.context.model.toLowerCase()));
      }
      return [];
    },

    propSearch() {
      return this.context.slotProps.component.search ?? {};
    },  

  },

  methods: {

    onFocus() {
      this.show = true;
      this.updateOptions();
    },

    onBlur(...args) {
      this.context.blurHandler(...args);
      setTimeout(() => {
        this.show = false;
      }, 100);
    },

    onEnter() {
      this.context.model = this.selection.label;
      this.show = false;
    },

    onKeydown() {
      this.show = true;
      this.updateOptions();
    },

    onSelect() {
      this.context.model = this.selection.label;
      this.show = false;
    },

    getItemClass(index) {
      const classes = [];

      if (index === this.selectedIndex) {
        classes.push('formulate-autocomplete__selected');
      }
      return classes;
    },

    async updateOptions() {
      if (typeof this.propSearch.handler === 'function') {
        this.options = await this.propSearch.handler({ component: this, input: this.context.model });
      }
    },

    getLabel(option) {
      if (typeof this.propSearch.label === 'function') {
        return this.propSearch.label(option);
      } else if (typeof this.propSearch.label === 'string') {
        return option[this.propSearch.label];
      } else {
        return option.label;
      }
    },

    getKey(option) {
      if (typeof this.propSearch.key === 'function') {
        return this.propSearch.key(option);
      } else if (typeof this.propSearch.key === 'string') {
        return option[this.propSearch.key];
      } else {
        return option.value;
      }
    },

    increment () {
      const length = this.filteredOptions.length;
      if (this.selectedIndex + 1 < length) {
        this.selectedIndex++;
      } else {
        this.selectedIndex = 0;
      }
    },

    decrement () {
      const length = this.filteredOptions.length;
      if (this.selectedIndex - 1 >= 0) {
        this.selectedIndex--;
      } else {
        this.selectedIndex = length - 1;
      }
    },

  },

}
</script>

<style lang="sass">
.formulate-autocomplete
  position: relative
  
  &__dropdown
    position: absolute
    top: 100%
    left: 0
    right: 0
    background: var(--form-color-bg)
    margin: 0
    padding: 0
    list-style: none
    border: var(--form-size-border) solid var(--form-color-border)
    border-top: 0
    box-shadow: 0 2px 4px #0008

  &__dropdown > li
    padding: calc(var(--form-size-gap) / 2) var(--form-size-gap)
    cursor: pointer

  &__selected
    background: var(--form-color-bg-group)

</style>
