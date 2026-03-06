<template lang="pug">
.page-temp-screen
  .page-temp-screen__slideshow
    TransitionGroup(name="fade")
      .page-temp-screen__slide(v-for="slide in slideCurrent", :key="slide.data.src")
        TempImage.page-temp-screen__image(:src="slide.data.src", :mutate="slide.data")
  .page-temp-screen__text
    .page-temp-screen__text-wrapper
      Transition(name="fade")
        .page-temp-screen__subline.font--sharp(v-if="subline")
          | {{ subline }}
      Transition(name="fade")
        .page-temp-screen__headline.font--old-london(v-if="headline")
          | {{ headline }}
  TempYoutubeVideo(ref="music")
  TempYoutubeVideo(ref="sound")
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

      headline: null,
      subline: null,
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
      if (this.images.length === 1) {
        this.slideLock = 0;
      } else {
        this.slideLock = null;
      }
      clearTimeout(this.slideTimeout);
      this.nextSlide();
    },

    nextSlide() {
      if (this.images === null) return;
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
        }, meta.time * this.settings.slideshow_speed);
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
      if (this.playlist.data.shuffle === 1) {
        this.musicIndex = this.randomInt(0, this.musics.length - 1) - 1;
      } else {
        this.musicIndex = -1;
      }
      this.nextMusic();
    },

    nextMusic() {
      if (this.musics === null) return;
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

    async setSlideshowSpeed(request, { speed }) {
      this.settings.slideshow_speed = speed;
    },

    async setSound(request, { sound }) {
      sound = await _storage.load('tmusic', sound);
      this.$refs.sound.play(sound.values());
    },

    async setText(request, { headline, subline }) {
      this.headline = headline;
      this.subline = subline;
    },

    randomInt(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    async stop(request, { }) {
      console.log('stop');
      this.playlist = null;
      this.musics = null;
      this.$refs.music.stop();

      this.slideshow = null;
      this.images = null;
      this.slideIndex = -1;
      this.slideLock = null;
      this.slideCurrent = [];
      clearTimeout(this.slideTimeout);
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

  &__text
    position: absolute
    inset: 0
    display: flex
    justify-content: center
    align-items: center

  &__headline
    font-size: 20vw
    text-align: center
    text-shadow: 0 2px 3px rgba(0,0,0,0.85), 0 0 12px rgba(255,0,0,0.75), 0 0 28px rgba(150,0,0,0.65), 0 0 45px rgba(90,0,0,0.6)
    color: #fac06e

  &__subline
    font-size: 8vw
    text-align: center
    color: #fac06e
  
</style>