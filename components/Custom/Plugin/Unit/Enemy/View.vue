<template lang="pug">
.custom-plugin-unit-enemy-view(:class="classes", @click.middle="onClick")
  .custom-plugin-unit-enemy-view__scaler(v-if="type", :style="scalerStyles")
    ElImage.custom-plugin-unit-enemy-view__image(v-if="type && type.value.img", :src="type.value.img", :style="imageStyles")
</template>

<script>
import RemoteSystem from 'zero-system/src/RemoteSystem';

/** @type {import('~/custom/server/enemy/Entity/EnemyType.entity')} */
let _enemyTypeStorage = null;

export default {

  inject: ['zui'],

  props: ['value', 'avatar'],

  data() {
    return {
      type: null,
    };
  },

  async created() {
    this.fetchEnemyType();
  },

  computed: {

    classes() {
      const classes = [];

      if (this.type && this.display.props?.mirror) classes.push('mirror');
      return classes.map(v => 'custom-plugin-unit-enemy-view--' + v);
    },

    display() {
      if (this.avatar !== undefined) {
        return this.type.value.displays?.avatar ?? {};
      } else {
        return this.type.value.displays?.default ?? {};
      }
    },

    scalerStyles() {
      const styles = {};

      styles.top = (this.display.top / 10) + 'vh';
      styles.left = (this.display.left / 10) + 'vw';
      return styles;
    },

    imageStyles() {
      const styles = {};

      styles.width = (this.display.width / 10) + 'vw';
      return styles;
    },

  },

  methods: {

    async fetchEnemyType() {
      _enemyTypeStorage ??= await RemoteSystem.get('entity.enemy_type');
      if (this.value.type) {
        this.type = await _enemyTypeStorage.load(this.value.type);
      }
    },

    onClick() {
      const window = this.zui.inline({
        component: 'Entity/ZUI/UnitType/Display',
        params: {
          entity: this.type,
          display: 'avatar',
        },
        frame: {
          title: 'Edit avatar "' + this.type.label + '"',
        },
      });
      window.addEvent('close', async event => {
        await _enemyTypeStorage.save(event.data.entity);
        this.fetchEnemyType();
      }); 
    },

  },

}
</script>

<style lang="sass">
.custom-plugin-unit-enemy-view
  display: flex
  justify-content: center
  align-items: center
  width: 10vw
  height: 10vw
  position: relative

  &__scaler
    position: relative

  &__image
    width: 100%
    height: auto

  &--mirror &__image
    transform: rotateY(180deg)

</style>