<template lang="pug">
.custom-plugin-card-attack-custom(:class="classes")
  .custom-plugin-card-attack-custom__header
  .custom-plugin-card-attack-custom__stars
  .custom-plugin-card-attack-custom__top
  .custom-plugin-card-attack-custom__bottom
</template>

<script>
export default {

  props: ['config'],

  computed: {

    classes() {
      const classes = [];

      if (this.hasSecond) classes.push('second');
      if (this.hasConnect) classes.push('connect');
      if (this.config?.secondoptions?.optional) classes.push('optional');
      if (this.config?.firstoptions?.ritual) classes.push('ritual');
      let nocost = true;
      for (const index in this.config?.cost ?? {}) {
        if (this.config?.cost[index]) {
          nocost = false;
          break;
        }
      }
      if (nocost) classes.push('nocost');
      return classes.map(v => 'custom-plugin-card-attack-custom--' + v);
    },

    hasSecond() {
      return this.config.second || this.config.secondoptions?.even || this.config.secondoptions?.odd;
    },

    hasConnect() {
      return this.hasSecond && this.connect !== null;
    },

    connect() {
      if (this.config.secondoptions) {
        if (this.config.secondoptions.add) return '+';
        if (this.config.secondoptions.equal) return '=';
        if (this.config.secondoptions.different) return '≠';
      }
      return null;
    },

  },

}
</script>

<style lang="sass">
.custom-plugin-card-attack-custom
  position: relative
  width: 100%
  height: 100%
  background: white
  box-shadow: 0 0 16px black
  display: grid
  grid-template-rows: 20px 1em 2fr 1fr
  gap: .5em
  padding: 1em
  box-sizing: border-box

  &__header
    border: 1px solid black

  &__top
    border: 1px solid black
    margin: 1em

  &__bottom
    border: 1px solid black

  &__stars
    border: 1px solid black

  

</style>