<template lang="pug">
.temp-youtube-video
  .temp-youtube-video__video(ref="video")
</template>

<script>
import YTPlayer from 'yt-player';

import AsyncPromise from 'zero-util/src/AsyncPromise';

import YoutubeUtil from '~/custom/util/YoutubeUtil';

/**
 * @typedef {Object} T_YoutubeItem
 * @property {string} src 
 * @property {number} [start] 
 * @property {number} [end]
 * @property {number} [volume] 
 */

export default {

  mounted() {
    if (process.client) {
      this.player.on('ended', event => {
        if (this.promise) {
          this.promise.resolve({
            event,
            reason: 'end',
            comp: this,
          })
        }
      });
    }
  },

  data() {
    return {
      video: null,
      promise: null,
      item: null,
      master_volume: .75,
      timeout: null,
    };
  },

  computed: {

    player() {
      if (this.video === null) {
        this.video = new YTPlayer(this.$refs.video);
        this.video.setVolume(100);
      }
      return this.video;
    },

  },

  methods: {

    /**
     * @param {T_YoutubeItem} item 
     * @returns {Promise<this>}
     */
    play(item) {
      this.item = item;
      const id = YoutubeUtil.getVideoId(this.item.src);
      this.player.once('cued', this.doPlay.bind(this));
      this.player.load(id, false, this.item.start ?? 0);
      if (this.promise) this.promise.reject({ reason: 'next', comp: this });
      this.promise = new AsyncPromise();
      return this.promise.promise;
    },

    doPlay() {
      clearTimeout(this.timeout);
      this.timeout = null;
      this.updateVolume();
      if (typeof this.item.end === 'number' && this.item.end !== 0) {
        this.timeout = setTimeout(() => {
          this.player.pause();
          if (this.promise) {
            this.promise.resolve({
              reason: 'end',
              comp: this,
            })
          }
        }, (this.item.end - (this.item.start ?? 0)) * 1000);
      }
      this.player.play();
    },

    setMasterVolume(volume) {
      this.master_volume = Math.max(0, Math.min(1, volume));
      this.updateVolume();
    },

    updateVolume() {
      if (this.item) {
        this.player.setVolume(100 * this.master_volume * Math.max(0, Math.min(1, this.item.volume)));
      }
    },

  },

}
</script>
  
<style lang="sass">
.temp-youtube-video
  display: none
</style>