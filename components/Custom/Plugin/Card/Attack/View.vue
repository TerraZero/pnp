<template lang="pug">
.custom-plugin-card-attack-view(:class="classes")
  svg(width="0" height="0" style="position: absolute; width: 0; height: 0; overflow: hidden;")
    defs
      clipPath#custom-plugin-card-attack-view__action-mask(clipPathUnits="objectBoundingBox")
        path(d="M 0 0 L 0.5 0.1 L 1 0 L 1 0.8 C 0.7 0.8 0.6 0.9 0.5 1 C 0.4 0.9 0.3 0.8 0 0.8 Z")
  .custom-plugin-card-attack-view__header
    .custom-plugin-card-attack-view__label {{ config.label }}
    .custom-plugin-card-attack-view__type
      .custom-plugin-card-attack-view__range(v-if="config?.type === 'range'") 🏹
      .custom-plugin-card-attack-view__combat(v-if="config?.type === 'combat'") 🗡️
      .custom-plugin-card-attack-view__magic(v-if="config?.type === 'magic'") ✨
      .custom-plugin-card-attack-view__shield(v-if="config?.type === 'shield'") 🛡️
      .custom-plugin-card-attack-view__weapon(v-if="config?.type === 'weapon'") ⚔️
      .custom-plugin-card-attack-view__legend(v-if="config?.type === 'legend'") 🌟
    .custom-plugin-card-attack-view__action
      .custom-plugin-card-attack-view__action-inner
        font-awesome-icon(v-if="config?.action === 'action'", :icon="['fas', 'circle']")
        font-awesome-icon(v-if="config?.action === 'bonus'", :icon="['fas', 'circle-half-stroke']")
        font-awesome-icon(v-if="config?.action === 'free'", :icon="['far', 'circle']")
        font-awesome-icon(v-if="config?.action === 'reaction'", :icon="['fas', 'shield']")
  .custom-plugin-card-attack-view__cost-wrapper
    .custom-plugin-card-attack-view__cost
      font-awesome-icon(v-if="config?.cost?.blood", :icon="['fas', 'tint']")
      .ra.ra-doubled(v-if="config?.cost?.rift")
      font-awesome-icon(v-if="config?.cost?.plant", :icon="['fas', 'seedling']")
      font-awesome-icon(v-if="config?.cost?.prepare", :icon="['fas', 'stopwatch']")
      .ra.ra-cancel(v-if="config?.cost?.noactions")
      font-awesome-icon(v-if="config?.cost?.perm", :icon="['fas', 'infinity']")
      font-awesome-icon(v-if="config?.cost?.light", :icon="['fas', 'feather-alt']")
      font-awesome-icon(v-if="config?.cost?.ki", :icon="['fas', 'yin-yang']")
      font-awesome-icon(v-if="config?.cost?.free", :icon="['fas', 'star-of-life']")
      .ra.ra-fizzing-flask(v-if="config?.cost?.braue")
      font-awesome-icon.custom-plugin-card-attack-view__bonus(v-if="config?.cost?.bonus", :icon="['fas', 'play']")
  .custom-plugin-card-attack-view__text
    CustomCardViewText(:text="config.text")
    CustomCardViewText.custom-plugin-card-attack-view__description(v-if="config.description", :text="config.description")
  .custom-plugin-card-attack-view__dices-wrapper
    .custom-plugin-card-attack-view__dices
      .custom-plugin-card-attack-view__first.custom-plugin-card-attack-view__dice
        .custom-plugin-card-attack-view__number 
          .custom-plugin-card-attack-view__num(v-if="config.first") {{ config.first }}
          .custom-plugin-card-attack-view__even(v-if="config.firstoptions?.even") ◯
          .custom-plugin-card-attack-view__odd(v-if="config.firstoptions?.odd") ⌀
        .custom-plugin-card-attack-view__min(v-if="config.firstoptions?.min")
        .custom-plugin-card-attack-view__max(v-if="config.firstoptions?.max")
      .custom-plugin-card-attack-view__connect(v-if="hasConnect") {{ connect }}
      .custom-plugin-card-attack-view__second.custom-plugin-card-attack-view__dice(v-if="hasSecond")
        .custom-plugin-card-attack-view__number 
          .custom-plugin-card-attack-view__num(v-if="!config.secondoptions?.even && !config.secondoptions?.odd") {{ config.second }}
          .custom-plugin-card-attack-view__even(v-if="config.secondoptions?.even") ◯
          .custom-plugin-card-attack-view__odd(v-if="config.secondoptions?.odd") ⌀
        .custom-plugin-card-attack-view__min(v-if="config.secondoptions?.min")
        .custom-plugin-card-attack-view__max(v-if="config.secondoptions?.max")
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
      return classes.map(v => 'custom-plugin-card-attack-view--' + v);
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
.custom-plugin-card-attack-view
  position: relative
  width: 100%
  height: 100%
  background: white
  box-shadow: 0 0 16px black

  &__header
    position: relative
    padding: 1em
    padding-bottom: 0

  &__type
    position: absolute
    width: 2em
    height: 2em
    display: flex
    justify-content: center
    align-items: center
    top: 1em
    left: 1em
    z-index: 2

  &__type:before
    content: ''
    position: absolute
    top: 0
    left: 0
    right: 0
    bottom: 0
    border: 2px solid black
    box-sizing: border-box
    transform: rotate(45deg)
    background: white

  &__label
    display: flex
    align-items: center
    box-sizing: border-box
    margin-left: .7em
    border: 2px solid black
    height: 2em
    padding-left: 1.8em
    position: relative

  &__label:after
    content: ''
    width: 20px
    height: 20px
    border-top: 2px solid black
    border-left: 2px solid black
    background: white
    position: absolute
    top: 3px
    right: -12px
    transform: rotate(-45deg)

  &__cost-wrapper
    padding: 0 2em 0 1em
    display: flex
    justify-content: right
    gap: .5em
    font-size: .9em

  &__cost
    position: relative
    padding: 3px 1em
    width: 70px
    display: flex
    justify-content: right
    gap: .5em
    margin-top: -2px

  &__cost:before
    content: ''
    position: absolute
    top: 0
    left: 0
    right: 0
    bottom: 0
    box-sizing: border-box
    border: 2px solid black
    transform: skew(-35deg, 0)

  &--nocost &__cost:before
    display: none

  &__range,
  &__combat,
  &__magic,
  &__shield,
  &__weapon,
  &__legend
    filter: brightness(0) saturate(100%)

  &__bonus
    transform: rotate(32deg) translateY(1px)

  &__text
    padding: .8em 1em .5em
    height: 167px
    font-size: .97em

  &--nocost &__text
    padding-top: 26px

  &__dice
    width: 1cm
    height: 1cm
    border: 2px solid black
    border-radius: 4px
    display: flex
    justify-content: center
    align-items: center
    position: relative
    font-weight: bold

  &__max,
  &__min
    border-radius: 2px
    width: .2cm
    height: .2cm
    position: absolute
    left: calc(50% - .1cm)
    box-sizing: border-box

  &__min
    border-top: 2px solid black
    border-right: 2px solid black
    top: 4px
    transform: rotate(-45deg)

  &__max
    border-bottom: 2px solid black
    border-right: 2px solid black
    bottom: 4px
    transform: rotate(45deg)

  &__odd
    font-size: 23px

  &__dices-wrapper
    position: absolute
    left: 1em
    right: 1em
    bottom: 1em
    height: 80px
    border: 2px solid black

  &__dices
    display: grid
    grid-template-columns: 1fr
    justify-items: center
    align-items: center
    width: 100%
    height: 100%

  &--second &__dices
    grid-template-columns: 1fr 1fr

  &--connect &__dices
    grid-template-columns: 3fr 1fr 3fr

  &__connect
    font-weight: bold
    font-size: 2em

  &--ritual &__first:after
    content: ''
    position: absolute
    top: -.9em
    left: -.9em
    right: -.9em
    bottom: -.9em
    border: 2px solid black
    border-radius: 50%

  &--optional &__second:before,
  &--optional &__second:after
    content: ""
    position: absolute
    top: -.5em
    bottom: -.5em
    width: 8px
    border-top: 2px solid black
    border-bottom: 2px solid black  
    box-sizing: border-box

  &--optional &__second:before
    border-left: 2px solid black
    left: -.5em

  &--optional &__second:after
    border-right: 2px solid black
    right: -.5em

  &__description
    margin-top: .5em 
    padding-top: .5em
    border-top: 1px solid black
    font-size: .7em
    font-style: italic

  &__action-mask
    display: none

  &__action
    z-index: 1
    position: absolute
    top: calc(100% - 1em)
    left: 1em
    width: 2em
    height: 3em
    background: black
    clip-path: url(#custom-plugin-card-attack-view__action-mask)

  &__action-inner
    position: absolute
    inset: 2px
    top: 3px
    bottom: 3px
    background: white
    clip-path: url(#custom-plugin-card-attack-view__action-mask)
    display: flex
    justify-content: center
    align-items: center
    padding-top: 20px
    height: 16px
    padding-bottom: 6px
    font-size: .9em

</style>