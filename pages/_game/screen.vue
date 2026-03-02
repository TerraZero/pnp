<template lang="pug">
.page-screen(ref="screen")
  .page-screen__screen(v-if="config.value.screens.logo")
    ZeroVideo.page-screen__screen(:video="video")
    ZeroLogo.page-screen__screen(ref="logo", :total="total", :current="current", :status="status", @finish="onLoadFinish")
  .page-screen__screen(v-if="config.value.screens.map && map")
    EditorViewGrid(:config="map.value.config", mode="screen", :rooms="map.value.rooms", :control="config", :size="mapsize")
      img.page-screen__map-image(ref="mapimage", :src="map.value.config.image", @load="onMapImageLoad")
  .page-screen__screen(v-if="config.value.screens.battle")
    CustomScreenUnits(:units="units", :turn="config.value.turn", :current="current", row)

  ZeroClickIndicator
</template>

<script>
import JSONUtil from 'zero-util/src/JSONUtil';
import RemoteSystem from 'zero-system/src/RemoteSystem';
import ComputedUtil from '~/custom/util/ComputedUtil';

/** @type {import('~/custom/server/eldritch/Remote/Sounds.remote')} */
let _SoundsRemote = null;
/** @type {import('~/custom/server/config/Entity/Config.entity')} */
let _ConfigStorage = null;
/** @type {import('~/custom/server/map/Entity/Map.entity')} */
let _MapStorage = null;

export default {

  async asyncData({ params }) {
    const data = { params };
    _ConfigStorage ??= await RemoteSystem.get('entity.config');

    data.config = await _ConfigStorage.loadByParams({ game: params.game, identify: 'control' });
    data.config.value.screens ??= {};
    data.config.value.screens.logo = true;
    return data;
  },

  data() {
    return {
      total: 0,
      current: 0,
      status: '',
      video: {
        src: '/eldritch/video/intro-video.mp4',
        speed: .5,
      },
      map: null,
      mapsize: {
        width: 100,
        height: 100,
      },
    };
  },

  async created() {
    _SoundsRemote ??= RemoteSystem.getSync('remote.sounds');
    _MapStorage ??= await RemoteSystem.get('entity.map');

    setTimeout(this.loadInit, 5000);
    const playlist = _SoundsRemote.setPlaylist([
      {
        id: 'songs/bg3-intro',
      },
      {
        id: 'songs/into-avernus',
      }
    ]);
    playlist.setSetting('loop', true);
    playlist.play();
    RemoteSystem.instance.socket.mount.request('eldritch.ident', {
      ident: 'screen',
    });
    RemoteSystem.instance.socket.mount.socket.on('update.screen', async ({ data }) => {
      // const diff = JSONUtil.diffDeep(this.config, data.entity);
      if (data.entity.value.map && data.entity.value.screens.map && this.map?.id !== data.entity.value.map) {
        this.map = await _MapStorage.load(data.entity.value.map);
      }
      if (data.entity.value.sounds) {
        _SoundsRemote.setMasterVolume(data.entity.value.sounds.volume ?? 50);
      }
      this.config = data.entity;
    });
    RemoteSystem.instance.socket.mount.socket.on('eldritch.screen', async ({ current }) => {
      this.current = current;
    });
    window.addEventListener('resize', this.onMapImageLoad.bind(this));
  },

  computed: {

    screen() {
      return this.$refs.screen;
    },

    mapimage() {
      return this.$refs.mapimage;
    },

    units() {
      const units = [...(this.config.value.heros ?? []), ...(this.config.value.enemy ?? [])];

      units.sort((a, b) => {
        if (a.init === b.init) return parseInt(a.pos ?? '0') - parseInt(b.pos ?? '0');
        return a.init - b.init;
      });

      return units;
    },

  },

  methods: {

    loadInit() {
      this.$refs.logo.start();
      this.total++;
      this.status = 'Loading sounds process ...';
      _SoundsRemote.load(({ instance, id }) => {
        this.total++;
        this.status = `Loading sound "${id}" ...`;
        instance.howl.on('load', () => {
          this.current++;
          this.status = `Finish loading sound "${id}"`;
        });
      });
      this.status = 'Finish loading sounds process ...';
      this.current++;
    },

    onLoadFinish() {
      this.status = 'Ready';
      this.$refs.logo.complete(2000);
    },

    onMapImageLoad() {
      if (this.screen && this.mapimage) {
        this.mapsize = ComputedUtil.getObjectFitElementSize(this.screen, this.mapimage);
      }
    },

  },

}
</script>

<style lang="sass">
.page-screen
  width: 100vw
  height: 100vh
  overflow: hidden
  position: relative
  background: black
  color: white

  &__screen
    position: absolute
    inset: 0

</style>