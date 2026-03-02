<template lang="pug">
.custom-editor-sound-board(:class="classes")
  .custom-editor-sound-board__current
    .custom-editor-sound-board__item
      .custom-editor-sound-board__item
    .custom-editor-sound-board__control
      .custom-editor-sound-board__playstop
        font-awesome-icon.custom-editor-sound-board__icon(v-if="play", :icon="['fas', 'play']")
        font-awesome-icon.custom-editor-sound-board__icon(v-if="!play", :icon="['fas', 'stop']")
  .custom-editor-sound-board__grid
    .custom-editor-sound-board__playlist(v-for="playlist in items", :key="playlist.id")
      .custom-editor-sound-board__content(@click="onPlaylistClick(playlist)")
        .custom-editor-sound-board__label
          | {{ playlist.name }} ({{ playlist.id }})
</template>

<script>
import RemoteSystem from 'zero-system/src/RemoteSystem';

/** @type {import('~/custom/server/media/Entity/Playlist.entity')} */
let _storage = null;

export default {

  inject: ['zui'],

  async created() {
    _storage = await RemoteSystem.get('entity.playlist');
    this.items = await _storage.loadAll();
  },

  data() {
    return {
      items: [],
      play: false,
    };
  },

  computed: {

    classes() {
      const classes = [];

      return classes.map(v => 'custom-editor-sound-board--' + v);
    },

  },

  methods: {

    onPlaylistClick(playlist) {
      this.zui.open('/transmit/playlist/' + playlist.id);
    },

  },

}
</script>


<style lang="sass">
.custom-editor-sound-board
  
  &__grid
    display: grid
    grid-template-columns: repeat(auto-fill, minmax(200px, 300px))

  &__playlist
    padding: .5em
  
  &__content
    padding: .5em
    background: var(--success)
    cursor: pointer

  &__current
    display: grid
    grid-template-columns: 1fr 100px
    padding: 1em

  &__playstop
    font-size: 40px
    border-radius: 50%
    background: var(--success-light)
    border: 1px solid var(--success)
    aspect-ratio: 1
    display: flex
    justify-content: center
    align-items: center
    cursor: pointer

  &__playstop:active
    background: var(--success)

</style>
    