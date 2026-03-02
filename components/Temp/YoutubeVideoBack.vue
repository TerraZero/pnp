<template lang="pug">
  .temp-youtube-video
    .temp-youtube-video__player(:id="playerId")
</template>

<script>
import YoutubeUtil from '~/custom/util/YoutubeUtil';

/**
 * @typedef {Object} T_YoutubeItem
 * @property {string} src 
 * @property {number} [start] 
 * @property {number} [end]
 * @property {number} [volume] 
 */

export default {

  data() {
    return {
      player: null,
      playerId: 'yt-player-' + Math.random().toString(36).substring(2, 9),
      item: null,
    };
  },

  mounted() {
    if (process.client) {
      this.loadYouTubeAPI();
    }
  },

  beforeDestroy() {
    if (this.player) {
      this.player.destroy();
    }
  },

  methods: {

    loadYouTubeAPI() {
      if (window.YT && window.YT.Player) {
        this.createPlayer();
        return;
      }

      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      document.head.appendChild(tag);

      window.onYouTubeIframeAPIReady = () => {
        this.createPlayer();
      };
    },

    createPlayer() {
      this.player = new window.YT.Player(this.playerId, {
        height: '0',
        width: '0',
        videoId: '',
        playerVars: {
          autoplay: 0,
        },
        events: {
          onReady: () => {
            this.$emit('ready');
            this.$emit('state', { status: 'ready' });
          },
          onStateChange: (event) => {
            const YT = window.YT;

            switch (event.data) {
              case YT.PlayerState.PLAYING:
                this.$emit('playing');
                this.$emit('state', { status: 'playing' });
                break;

              case YT.PlayerState.PAUSED:
                this.$emit('paused');
                this.$emit('state', { status: 'paused' });
                break;

              case YT.PlayerState.ENDED:
                this.$emit('ended');
                this.$emit('state', { status: 'ended' });
                break;
            }
          },
          onAutoplayBlocked: (...args) => {
            console.log('blocked', args);
          },
        }
      });
    },

    /**
     * @param {T_YoutubeItem} item
     */
    play(item) {
      if (!this.player) return;

      const videoId = YoutubeUtil.getVideoId(item.src);
      if (!videoId) return;

      this.item = item;

      const options = {
        videoId,
      };

      if (typeof this.item.start === 'number') {
        options.startSeconds = this.item.start;
      }

      if (typeof this.item.end === 'number') {
        options.endSeconds = this.item.end;
      }

      console.log(options);
      this.player.loadVideoById(options);
      this.player.playVideo();
      this.setVolume(this.item.volume);
    },

    pause() {
      if (this.player) this.player.pauseVideo();
    },

    stop() {
      if (this.player) this.player.stopVideo();
    },

    setVolume(volume) {
      if (!this.player) return;
      const normalized = Math.max(0, Math.min(100, volume));
      this.player.setVolume(normalized);
    },

  },

};
</script>