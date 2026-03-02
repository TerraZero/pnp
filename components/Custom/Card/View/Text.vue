<template lang="pug">
.custom-card-view-text
  span.custom-card-view-text__token(v-for="token in formatted", :key="token.string", :class="token.classes")
    font-awesome-icon.custom-card-view-text__icon.custom-card-view-text__fa(v-if="token.type === 'fa'", :icon="token.icon")
    strong.custom-card-view-text__icon.custom-card-view-text__strong(v-if="token.type === 'strong'", v-html="token.value")
    span.custom-card-view-text__icon.custom-card-view-text__string(v-if="token.type === 'string'", v-html="token.value")
    span.custom-card-view-text__icon.custom-card-view-text__unicode(v-if="token.type === 'unicode'", v-html="token.value")
    span.custom-card-view-text__icon.custom-card-view-text__rpg.ra(v-if="token.type === 'ra'", :class="token.icon")
    span.custom-card-view-text__icon.custom-card-view-text__dice(v-if="token.type === 'dice'", :class="token.icon")
</template>

<script>
import RemoteSystem from 'zero-system/src/RemoteSystem';

/** @type {import('~/custom/server/card/Remote/Card.remote')} */
let _cardRemote = null;

export default {

  props: ['text'],

  created() {
    _cardRemote = RemoteSystem.getSync('remote.card');
  },

  computed: {

    formatted() {
      return _cardRemote.getTextComponents(this.text ?? '').map(token => {
        if (token.value) {
          token.value = token.value.replace(/---\n/g, '<hr />');
          token.value = token.value.replace(/\n/g, '<br />');
        }
        token.classes ??= [];
        token.classes = token.classes.map(v => 'custom-card-view-text--' + v);
        return token;
      });
    },

  },

}
</script>

<style lang="sass">
.custom-card-view-text

  &--strong
    font-weight: bold

  &--odd
    font-size: 2em
    vertical-align: -4px

  &--rift > &__icon
    transform: rotate(45deg)

  &--rotate-45 > &__icon
    display: inline-block
    transform: rotate(45deg)

  &__unicode
    filter: brightness(0) saturate(100%)

  &--bonus > &__icon
    transform: rotate(32deg) translateY(1px)

  & hr
    border: 0
    border-top: 2px solid black
    margin: .2em 0

</style>