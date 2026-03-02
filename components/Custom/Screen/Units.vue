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
      .custom-screen-units__row-item(v-for="unit, index in rows", :key="unit.name", :class="getRowItemClasses(unit, index)", @click="onUnitAvatarClick(index)")
        .custom-screen-units__wrapper
          .custom-screen-units__frame(:style="getFrameStyles(unit)")
            CustomPlugin.custom-screen-units__avatar(:type="['unit', unit.unit, 'view']", :value="unit", avatar)
          .custom-screen-units__mark(v-if="unit.mark") {{ unit.mark }}
          .custom-screen-units__icons
            font-awesome-icon.custom-screen-units__dead(v-if="unit.props.dead", :icon="['fa', 'skull-crossbones']")
            font-awesome-icon.custom-screen-units__turn(v-if="unit.props.turn", :icon="['fa', 'hourglass-half']")
        font-awesome-icon.custom-screen-units__current(:icon="['fa', 'arrow-up']")
        
</template>

<script>
export default {

  inject: ['zui'],

  props: ['units', 'turn', 'current', 'select', 'row'],

  computed: {

    classes() {
      const classes = [];

      if (this.heros.length > 4) classes.push('hero-many');
      if (this.enemies.length > 4) classes.push('enemy-many');

      return classes.map(v => 'custom-screen-units--' + v);
    },

    showRow() {
      return this.row !== undefined;
    },

    rows() {
      return this.units.filter(v => v.props.show);
    },

    enemies() {
      return this.rows.filter(v => v.unit === 'enemy' && !v.props.dead);
    },

    heros() {
      return this.rows.filter(v  => v.unit === 'hero');
    },

  },

  methods: {

    getUnitStyle(list, unit, index) {
      const styles = {};

      const sector = this.getSector(4, index);
      const sectorIndex = this.getSectorIndex(4, index);
      const total = this.getSectorTotal(list.length, 4, index);

      if (total === 1) {
        styles.top = '50%';
      } else if (total === 2) {
        styles.top = `${30 + (sectorIndex / (total - 1)) * 40}%`;
      } else {
        if (sector === 1) {
          styles.top = `${20 + (sectorIndex / (total - 1)) * 60}%`;
        } else {
          styles.top = `${15 + (sectorIndex / (total - 1)) * 70}%`;
        }
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
      if (unit.init === (this.turn + '')) {
        classes.push('turn');
      } else if (this.turn !== undefined) {
        classes.push('no-turn');
      }
      
      return classes.map(v => 'custom-screen-units__unit--' + v);
    },

    getFrameStyles(unit) {
      const styles = {};

      let display = {};
      if (unit.unit === 'enemy') {
        display = {
          background: '#8c2f39',
        };
      } else {
        display = unit.displays?.avatar ?? {};
      }

      if (display.background) {
        styles['background-color'] = display.background;
      }
      return styles;
    },

    getRowItemClasses(unit, index) {
      const classes = [];

      if (unit.props.dead) {
        classes.push('dead');
      } 
      if (unit.init == this.turn) {
        classes.push('turn');
      } else if (this.turn !== undefined) {
        classes.push('no-turn');
      }
      classes.push(unit.unit);

      if (index === this.current) {
        classes.push('current');
      }
      if (index === this.select) {
        classes.push('select');
      }
      return classes.map(v => 'custom-screen-units__row-item--' + v);
    },

    onUnitAvatarClick(index) {
      this.$emit('update:select', index);
    },

  },

}
</script>

<style lang="sass">
.custom-screen-units
  position: relative
  width: 100%
  height: 100%
  display: grid
  grid-template-columns: 1fr 1fr

  &__heros,
  &__enemies
    position: relative

  &__unit
    position: absolute
    transform: translateY(-50%)
    transition: all .3s ease-in-out

  &__unit--no-turn
    filter: brightness(25%)

  &__enemies &__unit--near
    left: 10%

  &--enemy-many &__enemies &__unit--near
    left: 5%

  &__enemies &__unit--far
    left: 20%

  &--enemy-many &__enemies &__unit--far
    left: 15%

  &__enemies &__unit--near-near
    left: 35%

  &__enemies &__unit--far-far
    left: 45%

  &__heros &__unit--near
    right: 10%

  &--hero-many &__heros &__unit--near
    right: 5%

  &__heros &__unit--far
    right: 20%

  &--hero-many &__heros &__unit--far
    right: 15%

  &__heros &__unit--near-near
    right: 35%

  &__heros &__unit--far-far
    right: 45%

  &__rows
    position: absolute
    top: 0
    left: 50%
    transform: translateX(-50%)
    width: 100%
    text-align: center    

  &__row-item
    --custom-screen-unit--avatar-frame-color: #8c2f39
    display: inline-block
    width: 3vw
    background: var(--custom-screen-unit--avatar-frame-color)
    vertical-align: top
    transition: background .2s, width .2s
    position: relative
    cursor: pointer

    & + &
      margin-left: 2px

  &__row-item--hero
    --custom-screen-unit--avatar-frame-color: #087e8b

  &__row-item--turn
    --custom-screen-unit--avatar-frame-color: #f5cb5c
    width: 3.7vw

  &__row-item--dead
    --custom-screen-unit--avatar-frame-color: black

  &__row-item:hover,
  &__row-item--select
    --custom-screen-unit--avatar-frame-color: #ced4da

  &__row-item--current &__current
    display: inline-block

  &__current,
  &__row-item--hero &__current
    display: none

  &__row-item--dead &__current
    color: white

  &__frame
    height: 8vh
    margin: 5px
    border-radius: 7px
    background: white
    overflow: hidden
    transition: height .2s

  &__row-item--no-turn &__frame
    filter: brightness(50%)

  &__row-item--turn &__frame
    height: 9vh

  &__mark
    position: absolute
    top: 0
    right: 0
    background: var(--custom-screen-unit--avatar-frame-color)
    padding: .07vw .2vw
    color: white
    border-radius: 7px
    text-shadow: 0 0 5px black

  &__wrapper
    position: relative

  &__icons
    position: absolute
    bottom: 0
    left: 0
    right: 0
    display: flex
    justify-content: center
    gap: .2em

  &__dead,
  &__turn
    font-size: 1.5vw
    filter: drop-shadow(0 0 5px white) drop-shadow(0 0 15px white)

  &__turn
    color: white
    filter: drop-shadow(0 0 5px black) drop-shadow(0 0 15px black)

</style>