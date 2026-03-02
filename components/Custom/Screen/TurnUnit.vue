<template lang="pug">
.custom-screen-turn-unit(v-if="currentUnit", :class="classes")
  .custom-screen-turn-unit__content(v-if="currentUnit.unit === 'enemy' && currentUnit.attrs")
    CustomEditorEnemyAttrs(v-model="currentUnit.attrs")
    CustomEditorEnemyActions(v-if="type", :type="type")
    CustomEditorEnemySkills(v-if="type", :type="type")
  .custom-screen-turn-unit__header
    .custom-screen-turn-unit__current {{ currentUnit.name }} | {{ currentUnit.mark }}
    .custom-screen-turn-unit__dead(@click="onDead")
      font-awesome-icon(:icon="['fas', 'skull-crossbones']")
    .custom-screen-turn-unit__turn(@click="onTurn")
      font-awesome-icon(:icon="['fas', 'hourglass-half']")
    .custom-screen-turn-unit__next(v-if="!isNextTurn && select === -1", @click="onNext")
      font-awesome-icon(:icon="['fas', 'arrow-right']")
    .custom-screen-turn-unit__next-turn(v-if="isNextTurn && select === -1", @click="onNext")
      font-awesome-icon.std-rotate-90-rev(:icon="['fas', 'turn-down']")
    .custom-screen-turn-unit__edit-back(v-if="select !== -1", @click="onNext")
      font-awesome-icon(:icon="['fas', 'delete-left']")
        
</template>

<script>
import StoreUtil from '~/custom/util/StoreUtil';

const EnemyStore = StoreUtil.get('EnemyStore');

export default {

  props: ['units', 'turn', 'current', 'select'],

  watch: {

    turn() {
      this.setCurrent();
    },

  },

  created() {
    EnemyStore.fetchTypes();
    this.setCurrent();
  },

  computed: {

    classes() {
      const classes = [];

      if (this.currentUnit) {
        classes.push(this.currentUnit.unit);
        if (this.currentUnit.props.turn) classes.push('turn');
        if (this.currentUnit.props.dead) classes.push('dead');
      }
      return classes.map(v => 'custom-screen-turn-unit--' + v);
    },

    rows() {
      return this.units.filter(v => v.props.show);
    },

    type() {
      return EnemyStore.getType(this.currentUnit.type);
    },

    currentUnit() {
      if (this.rows[this.select]) return this.rows[this.select];
      return this.rows[this.current];
    },

    isNextTurn() {
      const next = this.getNextIndex();
      if (next === -1) return true;
      return this.rows[next].unit === 'hero';
    },

  },

  methods: {

    onNext() {
      if (this.select !== -1) {
        this.$emit('update:select', -1);
        return;
      }
      if (this.isNextTurn) {
        this.$emit('next-turn', this);
      } else {
        this.currentUnit.props.turn = true;
        const next = this.getNextIndex();
        if (next !== -1) this.setCurrent(next);
        this.$emit('change');  
      }
    },

    onTurn() {
      this.currentUnit.props.turn = !this.currentUnit.props.turn;
      this.$emit('change');
    },

    onDead() {
      this.currentUnit.props.dead = !this.currentUnit.props.dead;
      this.$emit('change');
    },

    getNextIndex() {
      return this.rows.findIndex(v => v.init == this.turn && !v.props.turn && !v.props.dead);
    },

    setCurrent(current = null) {
      if (current === null) {
        this.$emit('update:current', this.getNextIndex());
      } else {
        this.$emit('update:current', current);
      }
    },

  },

}
</script>

<style lang="sass">
.custom-screen-turn-unit
  position: absolute
  bottom: 2em
  left: 30%
  width: 40%
  border: 2px solid #515151
  background: #181818
  display: grid
  grid-template-rows: 1fr min-content

  &--hero
    grid-template-rows: min-content

  &__header
    display: grid
    grid-template-columns: 1fr min-content min-content min-content
    align-items: center
    background: #414141
    color: white

  &--enemy &__header
    border-top: 2px solid #515151

  &__current
    text-align: center
    padding: .2em
    font-size: 1.5em

  &__prev,
  &__next,
  &__next-turn,
  &__turn,
  &__dead,
  &__edit-back
    font-size: 1.5em
    cursor: pointer
    background: #00bdb5
    aspect-ratio: 1
    height: 100%
    display: flex
    justify-content: center
    align-items: center

  &__next-turn
    background: #f27059

  &__content
    height: 30vh
    color: white
    display: grid
    grid-template-rows: min-content
    gap: 1em
    overflow: auto
    padding: .5em

  &__dead,
  &__turn 
    border-right: 2px solid #515151
    background: #181818

  &--dead &__dead,
  &--turn &__turn
    background: #00bdb5

</style>