<template lang="pug">
.zero-video
  video.zero-video__video(v-if="src", ref="video", :src="src", autoplay, loop, muted, playsinline, @play="event('play', $event)", @playing="event('playing', $event)", @pause="event('pause', $event)", @stop="event('stop', $event)")
    
</template>

<script>
export default {

  props: ['video'],

  computed: {

    src() {
      return this.video?.src;
    },

  },

  methods: {

    event(event, ...args) {
      if (event === 'play') this.setSettings(this.video);
      this.$emit('event', { event, video: this, args });
      this.$emit(event, ...args);
    },

    setSettings(settings = null) {
      if (settings?.speed) this.setSpeed(settings.speed);
    },

    setSpeed(speed) {
      this.$refs.video.playbackRate = speed;
    },

  },

}
</script>

<style lang="sass">
.zero-video
  width: 100%
  height: 100%

  &__video
    width: 100%
    height: 100%
    opacity: .4
    object-fit: cover

</style>