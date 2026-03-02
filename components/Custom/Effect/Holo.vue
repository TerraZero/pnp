<template lang="pug">
.custom-screen-units(:class="classes")
  .custom-screen-units__enemies
    transition-group(name="fade-left-soft")
      .custom-screen-units__unit.custom-screen-units__enemy(v-for="enemy, index in enemies", :key="'enemy-' + enemy.name", :class="getUnitClasses(enemies, enemy, index)", :style="getUnitStyle(enemies, enemy, index)")
        CustomPluginUnitEnemyView(:value="enemy")
  .custom-screen-units__heros
    transition-group(name="fade-right-soft")
      .custom-screen-units__unit.custom-screen-units__hero(v-for="hero, index in heros", :key="'hero-' + hero.name", :class="getUnitClasses(heros, hero, index)", :style="getUnitStyle(heros, hero, index)")
        CustomPluginUnitHeroView(:value="hero")
  .custom-screen-units__rows(v-if="showRow")
    transition-group(name="fade")
      .custom-screen-units__row-item(v-for="item in rowUnits", :key="item.key")
        .custom-screen-units__frame(:style="getFrameStyles(item)")
          CustomPlugin.custom-screen-units__avatar(:type="['unit', item.type, 'view']", :value="item.unit", avatar)
        
</template>

<script>
export default {

  props: ['heros', 'enemies', 'row'],

  created() {
    console.log(this.heros, this.enemies);
  },

  computed: {

    classes() {
      const classes = [];

      classes.push('hero-' + this.heros.length);
      if (this.heros.length > 4) classes.push('hero-many');

      classes.push('enemy-' + this.enemies.length);
      if (this.enemies.length > 4) classes.push('enemy-many');

      return classes.map(v => 'custom-screen-units--' + v);
    },

    showRow() {
      return this.row !== undefined;
    },

    rowUnits() {
      const units = [];

      for (const hero of this.heros) {
        units.push({
          key: 'row-' + hero.name,
          type: 'hero',
          unit: hero,
        });
      }

      for (const enemy of this.enemies) {
        units.push({
          key: 'row-' + enemy.name,
          type: 'enemy',
          unit: enemy,
        });
      }
      return units;
    },

  },

  methods: {

    getUnitStyle(list, unit, index) {
      const styles = {};

      const sectorIndex = this.getSectorIndex(4, index);
      const total = this.getSectorTotal(list.length, 4, index);

      if (total === 1) {
        styles.top = '50%';
      } else if (total === 2) {
        styles.top = `${30 + (sectorIndex / (total - 1)) * 40}%`;
      } else {
        styles.top = `${15 + (sectorIndex / (total - 1)) * 70}%`;
      }
      return styles;
    },

    getSectorTotal(length, sector, index) {
      return Math.min(sector, length - Math.floor(index / sector) * sector);
    },

    getSectorIndex(sector, index) {
      return index % sector;
    },

    getSector(sector, index) {
      return Math.floor(index / sector);
    },

    getUnitClasses(list, unit, index) {
      const classes = [];

      if (list.length < 3) {
        classes.push('far');
      } else {
        const sector = this.getSector(4, index);
        const total = this.getSectorTotal(list.length, 4, index);
        const sectorIndex = this.getSectorIndex(4, index);

        if (sector === 0) {
          if (sectorIndex === 0 || sectorIndex === total - 1) {
            classes.push('far');
          } else {
            classes.push('near');
          }
        } else if (sector === 1) {
          if (sectorIndex === 0 || sectorIndex === total - 1) {
            classes.push('far-far');
          } else {
            classes.push('near-near');
          }
        }
      }
      classes.push('pos-' + index);
      return classes.map(v => 'custom-screen-units__unit--' + v);
    },

    getFrameStyles(item) {
      const styles = {};
      
      const background = item.unit.displays?.avatar?.background ?? null;

      if (background) {
        styles['background-color'] = background;
      }
      return styles;
    },

  },

}
</script>

<style lang="sass">
@keyframes holoShimmer
  0%
    mask-position: 0% 0%
  100%
    mask-position: 100% 100%

.holo-wrapper
  position: relative
  mask-image: var(--image)
  mask-size: 100% 100%
  mix-blend-mode: overlay

.holo-shine
  position: absolute
  inset: 0
  background: url('https://www.kitaeinkauf.de/media/9c/ee/13/1720169715/4313-regenbogenpapier-doppelseitig--35x50-cm--200-g--30-bogen.jpg?ts=1732095953')
  mask-image: linear-gradient(-45deg, transparent 40%, black 45%, black 55%, transparent 60%)
  mask-size: 200% 200%
  mask-repeat: no-repeat
  animation: holoShimmer 2s infinite alternate ease-in-out
  mix-blend-mode: difference

</style>