<template lang="pug">
.zero-logo(:class="classes")
  .zero-logo__logo
    svg.zero-logo__circle(xmlns="http://www.w3.org/2000/svg" viewBox="0 0 106 106" width="600" height="600")
      circle(cx="53" cy="53" r="47" stroke="white" stroke-width="5" fill="transparent" shape-rendering="geometricPrecision")
      path.logo__top-left-outer(d="M 7 68 a 62,82 -40 0 1 90,-55 a -80,-72 30 0 0 -90,54 z" stroke="white" fill="white")
      path.logo__bottom-right-outer(d="M 98 38 a 62,82 -40 0 1 -90,55 a 80,72 30 0 0 90,-54 z" stroke="white" fill="white")

    svg.zero-logo__letters(xmlns="http://www.w3.org/2000/svg" viewBox="0 0 106 106" width="600" height="600")
      path.logo__t(d="M 33, 33 l 40 0 m -20 0 l 0 48 z" stroke="white" stroke-width="4" fill="transparent")
      path.logo__z(d="M 38, 41 l 27 0 l -24 30 l 27 0 M 35 38 z" stroke="white" stroke-width="4" fill="transparent")
  .zero-logo__loading
    .zero-logo__bar
      .zero-logo__fill(:style="barStyle")
    .zero-logo__advance
      .zero-logo__status {{ status }}
      .zero-logo__number {{ current }} / {{ total }}
    
</template>

<script>
export default {

  props: ['current', 'total', 'status'],

  watch: {

    current() {
      this.check();
    },

    total() {
      this.check();
    },

  },

  data() {
    return {
      started: false,
      completing: false,
      completed: false,
    };
  },

  computed: {

    classes() {
      const classes = [];

      if (this.started) classes.push('started');
      if (this.completing) classes.push('completing');
      if (this.completed) classes.push('completed');
      return classes.map(v => 'zero-logo--' + v);
    },

    percentage() {
      return this.current * 100 / this.total;
    },

    barStyle() {
      return {
        width: this.percentage + '%',
      };
    },

  },

  methods: {

    complete(timeout = 0) {
      this.completing = true;
      setTimeout(() => {
        this.completed = true;
      }, timeout);
    },

    start() {
      this.started = true;
    },

    check() {
      if (this.started && this.current >= this.total) {
        this.$emit('finish');
      }
    },

  },

}
</script>

<style lang="sass">
.zero-logo
  width: 100%
  height: 100%
  display: flex
  justify-content: center
  align-items: center
  flex-direction: column

  &__logo
    position: relative
    width: 30vw
    height: 30vw
    filter: drop-shadow(0 0 30px black) drop-shadow(0 0 40px black) drop-shadow(0 0 50px black)

  &__letters
    position: absolute
    inset: 0
    width: 30vw
    height: 30vw
    animation: zero-logo__letters-init 6s ease-in-out forwards, zero-logo__letters 10s ease-in-out infinite
    animation-delay: 0s, 6s

  &__circle
    position: absolute
    inset: 0
    width: 30vw
    height: 30vw
    animation: zero-logo__circle-init 6s ease-in-out forwards, zero-logo__circle 10s ease-in-out infinite
    animation-delay: 0s, 6s

  &__loading
    color: var(--zero-logo--fill-color, white)
    width: 30vw
    margin-top: 5vh
    opacity: 0
    transition: opacity 1s ease-in-out

  &--started &__loading
    opacity: 1

  &--completed &__loading
    opacity: 0

  &--completing &__loading
    --zero-logo--fill-color: green

  &__bar
    border: 4px solid white
    border-top-width: 0
    border-bottom-width: 0
    height: 2vh
    padding: 4px
    position: relative

  &__fill
    background: var(--zero-logo--fill-color, white)
    height: 100%
    transition: background .5s ease-in-out, height .5s ease-in-out

  &__advance
    font-size: 2em
    margin-top: .2em
    transition: color .5s ease-in-out
    padding-right: 6px
    display: grid
    grid-template-columns: 1fr min-content

  &__number
    white-space: nowrap

@keyframes zero-logo__circle-init
  0%
    width: 120vw
    height: 120vw
    top: -45vw
    left: -45vw
    opacity: 0
    transform: rotate(-52deg)
  60%
    width: 120vw
    height: 120vw
    top: -45vw
    left: -45vw
    opacity: 0
    transform: rotate(-52deg)
  80%
    width: 30vw
    height: 30vw
    top: 0px
    left: 0px
    opacity: 1
    transform: rotate(-52deg)
  100%
    transform: rotate(0)
    

@keyframes zero-logo__circle
  0%
    transform: rotate(0)
  40%
    transform: rotate(0)
  60%
    transform: rotate(360deg)
  100%
    transform: rotate(360deg)

@keyframes zero-logo__letters-init
  0%
    opacity: 0
  40%
    opacity: 0
  50%
    opacity: 1
  100%
    opacity: 1

@keyframes zero-logo__letters
  0%
    transform: rotateY(0deg)
  60%
    transform: rotateY(0deg)
  80%
    transform: rotateY(360deg)
  100%
    transform: rotateY(360deg)

</style>