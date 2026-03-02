<template lang="pug">
.page-temp-screen
  .page-temp-screen__slideshow
    TransitionGroup(name="fade")
      .page-temp-screen__slide(v-for="slide in slideCurrent", :key="slide.data.src")
        TempImage.page-temp-screen__image(:src="slide.data.src", :mutate="slide.data")
</template>

<script>
import RemoteSystem from 'zero-system/src/RemoteSystem';

/** @type {import('~/custom/server/action/Remote/Router.remote')} */
let _router = null;
/** @type {import('~/custom/server/temp/Remote/TempStorage.remote')} */
let _storage = null;

let _interval = null;

export default {

  async asyncData({ params }) {
    _router ??= await RemoteSystem.get('remote.router');
    _storage ??= await RemoteSystem.get('remote.tempstorage');

    return { params };
  },

  async mounted() {
    clearInterval(_interval);
    _interval = setInterval(async () => {
      this.status = await _storage.screen().register();
      await _storage.control().setStatus(this.slideshow !== null);
    }, 1000);
    _storage.screen().init(async (request, mount, answer) => {
      let response = undefined;
      if (typeof request.data.func === 'string' && typeof this[request.data.func] === 'function') {
        this[request.data.func]({ request, answer: (v) => { response = v; } }, request.data.params);
      }
      console.log('handler command.screen', request);
      answer(response ?? { status: 'ok' });
    });
  },

  data() {
    return {
      slideshow: null,
      images: null,
      slideCurrent: [],
      slideIndex: -1,
      slideTimeout: null,
      slideLock: null,
    };
  },

  methods: {

    async setSlides(request, { slideshow }) {
      this.slideshow = await _storage.load('tslideshow', slideshow);
      this.images = await this.slideshow.getRef('images');
      this.slideIndex = -1;
      this.slideLock = null;
      clearTimeout(this.slideTimeout);
      this.nextSlide();
    },

    nextSlide() {
      this.slideIndex = (this.slideIndex + 1) % this.images.length;
      this.slideCurrent.unshift(this.images[this.slideIndex]);
      _storage.control().setSlide(this.slideshow.id(), this.slideIndex, this.slideLock);
      if (this.slideCurrent.length > 1) {
        setTimeout(() => {
          this.slideCurrent.pop();
        }, 500);
      }
      if (this.slideLock === null) {
        const meta = this.slideshow.data.value?.meta_images[this.slideIndex] ?? { time: 10000 };
        this.slideTimeout = setTimeout(() => {
          this.nextSlide();
        }, meta.time);
      }
    },

    async setSlideLock(request, { image }) {
      if (image === this.slideLock) return;
      this.slideLock = image;
      if (this.slideLock !== null) {
        this.slideIndex = this.images.findIndex(v => v.id() === this.slideLock) - 1;
        clearTimeout(this.slideTimeout);
      }
      this.nextSlide();
    },

  },

};
</script>

<style lang="sass">
.page-temp-screen
  display: block

  &__slideshow
    position: relative
    width: 100vw
    height: 100vh
    overflow: hidden

  &__slide
    position: absolute
    inset: 0

  &__image
    position: absolute
    inset: 0
  
</style>