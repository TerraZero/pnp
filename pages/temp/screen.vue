<template lang="pug">
.page-temp-screen
  .page-temp-screen__slideshow
    TransitionGroup(name="fade")
      .page-temp-screen__slide(v-for="slide in slideCurrent", :key="slide.data.src")
        TempImage.page-temp-screen__image(:src="slide.data.src", :mutate="slide.data")
  TempYoutubeVideo(ref="music")
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

    const settings = await _storage.getState('control.settings', {
      master_volume: .5,
      slideshow_speed: 1,
    });

    return { params, settings };
  },

  async mounted() {
    clearInterval(_interval);
    _interval = setInterval(async () => {
      this.status = await _storage.screen().register();
      await _storage.control().setStatus(this.slideshow !== null, this.playlist !== null);
      if (this.playlist !== null) {
        await _storage.control().setPlaylist(this.playlist.id(), this.musicIndex);
      }
    }, 1000);
    _storage.screen().init(async (request, mount, answer) => {
      let response = undefined;
      if (typeof request.data.func === 'string' && typeof this[request.data.func] === 'function') {
        this[request.data.func]({ request, answer: (v) => { response = v; } }, request.data.params);
      }
      console.log('handler command.screen', request);
      answer(response ?? { status: 'ok' });
    });
    this.$refs.music.setMasterVolume(this.settings.master_volume);
  },

  data() {
    return {
      slideshow: null,
      images: null,
      slideCurrent: [],
      slideIndex: -1,
      slideTimeout: null,
      slideLock: null,

      playlist: null,
      musics: null,
      musicIndex: -1,
    };
  },

  methods: {

    onClick() {
      this.$refs.music.play({
        src: 'https://www.youtube.com/watch?v=QWGEFLZi3q0',
      });
    },

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

    async setPlaylist(request, { playlist }) {
      this.playlist = await _storage.load('tplaylist', playlist);
      this.musics = await this.playlist.getRef('musics');
      this.musicIndex = -1;
      this.nextMusic();
    },

    nextMusic() {
      this.musicIndex = (this.musicIndex + 1) % this.musics.length;
      _storage.control().setPlaylist(this.playlist.id(), this.musicIndex);
      this.$refs.music.play(this.musics[this.musicIndex].values())
        .then(() => {
          this.nextMusic();
        });
    },

    async setMasterVolume(request, { volume }) {
      this.$refs.music.setMasterVolume(volume);
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