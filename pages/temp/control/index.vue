<template lang="pug">
.page-temp-control(:class="classes")
  TempBreadcrumb(top)
    template
      ElBreadcrumbItem(:to="{ path: '/temp/admin' }") Admin
      ElBreadcrumbItem Control
    template(#right)
      TempBreadcrumbState(icon="picture", :status="status.screen ? 'success' : 'error'")
      TempBreadcrumbState(icon="s-platform", :status="status.control ? 'success' : 'error'")
      TempBreadcrumbButton(:status="battle ? 'success' : 'error'", unicode, @click="onBattle") ⚔️
      TempBreadcrumbButton(icon="s-tools", @click="onSetting")
      TempBreadcrumbButton(icon="s-home", to="/temp/admin")
      TempBreadcrumbButton(icon="switch-button", status="error", @click="onStop")
  .page-temp-control__content
    .page-temp-control__grid
      .page-temp-control__top-left
        .page-temp-control__slide(v-for="slide in slides", :key="slide.id()", @click="onSlideLock(slide)")
          TempImage.page-temp-control__slide-image(:src="slide.data.src", :mutate="slide.data")
          .page-temp-control__slide-label {{ slide.data.label }}
      .page-temp-control__top-right
        .page-temp-control__item(v-for="item in items", :key="item.id")
          TempImage.page-temp-control__item-image(:src="item.thumbnail")
          .page-temp-control__item-label {{ item.label }}
      .page-temp-control__left.grid--flex-small
        .page-temp-control__slideshow(v-for="slideshow in slideshows", :key="slideshow.id", @click="onSlideshowClick(slideshow)")
          TempImage.page-temp-control__image(:src="slideshow.image.src", :mutate="slideshow.image")
          .page-temp-control__label {{ slideshow.label }}
      .page-temp-control__right.grid--flex-small
        .page-temp-control__playlist(v-for="playlist in playlists", :key="playlist.id", @click="onPlaylistClick(playlist)")
          TempImage.page-temp-control__image(:src="playlist.thumbnail")
          .page-temp-control__label {{ playlist.label }}
    .page-temp-control__sounds
      .page-temp-control__sound(v-for="sound in sounds", :key="sound.id()", @click="onSoundClick(sound)")
        | {{ sound.data.label }}
  TempDialog(:visible.sync="setting", editor, inset="2em", title="Settings")
    h2 Sound
    EditorInputSlider(v-model="settings.master_volume", label="Master Volume", :min="0", :max="1", :step="0.01", :track="false", @input="onSettingsChange")
    h2 Slideshow
    EditorInputSlider(v-model="settings.slideshow_speed", label="Slideshow Speed", :min="0", :max="2", :step="0.01", :track="false", @input="onSettingsChange")
    .page-temp-control__text-form
      EditorInputTextfield(v-model="headline", label="Headline")
      EditorInputTextfield(v-model="subline", label="Subline")
      ElButton(type="primary", @click="onText") Send
      ElButton(type="danger", @click="onClear") Clear
</template>

<script>
import RemoteSystem from 'zero-system/src/RemoteSystem';
import TimingUtil from 'zero-util/src/TimingUtil';
import YoutubeUtil from '~/custom/util/YoutubeUtil';

/** @type {import('~/custom/server/action/Remote/Router.remote')} */
let _router = null;
/** @type {import('~/custom/server/temp/Remote/TempStorage.remote')} */
let _storage = null;

let _interval = null;

export default {

  async asyncData({ params }) {
    _router ??= await RemoteSystem.get('remote.router');
    _storage ??= await RemoteSystem.get('remote.tempstorage');

    const soundsresults = await _storage.list('tmusic', {
      status: 1,
      channel: 'sound',
    });

    const playlistresults = await _storage.list('tplaylist', {
      status: 1,
    });

    const playlists = [];
    for (const playlist of playlistresults.entities) {
      let music = await playlist.getRef('musics', 0);

      music = music.values();
      const id = YoutubeUtil.getVideoId(music.src);
      playlists.push({
        id: playlist.id(),
        label: playlist.label(),
        music,
        thumbnail: YoutubeUtil.getVideoThumbnail(id),
      });
    }

    const slideshowresults = await _storage.list('tslideshow', {
      status: 1,
    });

    const slideshows = [];
    for (const slideshow of slideshowresults.entities) {
      const image = await slideshow.getRef('images', 0);
      slideshows.push({
        id: slideshow.id(),
        label: slideshow.label(),
        image: image.values(),
      });
    }

    const settings = await _storage.getState('control.settings', {
      master_volume: .75,
      slideshow_speed: 1,
    });

    console.log('playlists', playlists);

    console.log('slideshows', slideshows);

    console.log('settings', settings);

    console.log('sounds', soundsresults.entities);

    return { params, playlists, slideshows, settings, sounds: soundsresults.entities };
  },

  async mounted() {
    clearInterval(_interval);
    _interval = setInterval(async () => {
      this.status = await _storage.control().register();
    }, 1000);
    _storage.control().init(async (request, mount, answer) => {
      let response = undefined;
      if (typeof request.data.func === 'string' && typeof this[request.data.func] === 'function') {
        this[request.data.func]({ request, answer: (v) => { response = v; } }, request.data.params);
        console.log('handler command.control', request.data.func, request.data.params);
      } else {
        console.log('handler command.control', request);
      }
      answer(response ?? { status: 'ok' });
    });
  },

  data() {
    return {
      setting: false,
      status: {
        control: false,
        screen: false,
      },
      battle: false,
      slideshow: null,
      images: null,
      slides: null,
      slideLock: null,
      playlist: null,
      musics: null,
      items: null,

      headline: null,
      subline: null,
    };
  },

  computed: {

    classes() {
      const classes = [];

      if (this.slideLock !== null) classes.push('slide-lock');
      return classes.map(v => 'page-temp-control--' + v);
    },

  },

  methods: {

    onBattle() {
      this.battle = !this.battle;
    },

    async onSlideshowClick(slideshow) {
      await _storage.screen().setSlides(slideshow.id);
    },

    async onSlideLock(slide) {
      if (this.slideLock === slide.id()) {
        await _storage.screen().setSlideLock(null);
      } else {
        await _storage.screen().setSlideLock(slide.id());
      }
    },

    async onPlaylistClick(playlist) {
      await _storage.screen().setPlaylist(playlist.id);
    },

    async onSoundClick(sound) {
      await _storage.screen().setSound(sound.id());
    },

    onSetting() {
      this.setting = true;
    },

    onSettingsChange: TimingUtil.debounce(async function() {
      console.log(this.settings);
      await _storage.setState('control.settings', this.settings);
      await _storage.screen().setMasterVolume(this.settings.master_volume);
      await _storage.screen().setSlideshowSpeed(this.settings.slideshow_speed);
    }, 1000),

    async onText() {
      await _storage.screen().setText(this.headline, this.subline);
    },

    async onClear() {
      await _storage.screen().setText(null, null);
    },

    async onStop() {
      await _storage.screen().stop();
    },

    async setSlide(request, { slideshow, index, lock }) {
      if (this.slideshow?.id() !== slideshow) {
        this.slideshow = await _storage.load('tslideshow', slideshow);
        this.images = await this.slideshow.getRef('images');
      }
      const slides = [];
      for (let i = 0; i < this.images.length; i++) {
        slides.push(this.images[(i + index) % this.images.length]);
      }
      this.slides = slides;
      this.slideLock = lock;
    },

    async setPlaylist(request, { playlist, index }) {
      if (this.playlist?.id() !== playlist) {
        this.playlist = await _storage.load('tplaylist', playlist);
        this.musics = await this.playlist.getRef('musics');
      }
      const items = [];
      for (let i = 0; i < this.musics.length; i++) {
        const item = this.musics[(i + index) % this.musics.length].values();
        item.videoId = YoutubeUtil.getVideoId(item.src);
        item.thumbnail = YoutubeUtil.getVideoThumbnail(item.videoId);
        items.push(item);
      }
      this.items = items;
    },

    async setStatus(request, { slideshow, playlist }) {
      if (!slideshow && this.slideshow !== null) {
        this.slideshow = null;
        this.images = null;
        this.slides = null;
      }
      if (!playlist && this.playlist !== null) {
        this.playlist = null;
        this.musics = null;
        this.items = null;
      }
    },

  },

};
</script>

<style lang="sass">
.page-temp-control

  &__content
    height: calc(100vh - 28px)
    box-sizing: border-box
    background: var(--color--background)
    display: grid
    grid-template-rows: 9fr 1fr

  &__grid
    display: grid
    grid-template-columns: repeat(2, 1fr)
    grid-template-rows: 180px 9fr
    height: 100%

  &__top-left,
  &__top-right
    background: var(--color--dark)
    display: flex
    gap: .3em
    padding: .5em
    overflow: auto

  &__left,
  &__right
    padding: .5em
    overflow: auto

  &__playlist,
  &__slideshow
    padding: .5em
    background: var(--color--main)
    cursor: pointer
    transition: .2s ease-in-out

  &__playlist:hover,
  &__slideshow:hover
    background: var(--color--main-light)

  &__label
    text-align: center

  &__image
    aspect-ratio: 16/9
    margin-bottom: .5em

  &__item-image,
  &__slide-image
    aspect-ratio: 16/9
    max-width: 225px

  &__item,
  &__slide
    width: 15vw
    padding: .5em
    max-width: 225px
    position: relative
    flex-shrink: 0
    cursor: pointer

  &__slide:hover:after
    content: ''
    position: absolute
    inset: 0
    background: #F002

  &__item:first-child,
  &__slide:first-child
    background: var(--color--highlight-second-light)

  &--slide-lock &__slide:first-child
    background: var(--error)

  &__slide:first-child > &__slide-time
    position: absolute
    bottom: 0
    left: 0
    height: 5%
    background: var(--error-status)
    width: 0

  &__item-label,
  &__slide-label
    padding: .4em .5em
    text-align: center
    text-overflow: ellipsis
    max-width: 100%
    white-space: nowrap
    overflow: hidden

  &__sounds
    display: flex
    flex-wrap: wrap
    gap: .5em
    padding: .5em

  &__sound
    padding: .5em
    background: var(--color--main)
    height: 50%
    display: inline-flex
    box-sizing: border-box
    justify-content: center
    align-items: center
    cursor: pointer
    transition: .2s ease-in-out

  &__sound:hover
    background: var(--color--main-light)

  &__text-form
    margin-top: 1em
    display: grid
    grid-template-columns: 1fr
    gap: 1em
  
</style>