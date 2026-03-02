<template lang="pug">
.entity-zui-playlist-transmit
  .entity-zui-playlist-transmit__actions
    ElButton(type="primary").entity-zui-playlist-transmit__submit(@click="onSubmit") Transmit >>
  .entity-zui-playlist-transmit__content
    .entity-zui-playlist-transmit__audios(v-if="audios")
      ZUIElementCheckboxes(v-model="selected", :options="options")
</template>

<script>
import RemoteSystem from 'zero-system/src/RemoteSystem';

let _storage = null;
let _audioStorage = null;

export default {

  props: ['id'],

  inject: ['zuiw'],

  async created() {
    this.zuiw.setLoading(true);
    _storage ??= await RemoteSystem.get('entity.playlist');
    _audioStorage ??= await RemoteSystem.get('entity.audio');

    this.playlist = await _storage.load(this.id);
    this.audios = await _audioStorage.multi(this.playlist.playlist.map(v => v.id));
    this.selected = this.playlist.playlist.map(v => v.id + '');
    this.zuiw.setTitle('Transmit playlist: ' + this.playlist.name);
    this.zuiw.setLoading(false);
  },

  data() {
    return {
      playlist: null,
      audios: null,
      selected: [],
    };
  },

  computed: {

    options() {
      const options = {};

      if (this.audios) {
        for (const audio of this.audios) {
          options[audio.id] = audio.name;
        }
      }
      return options;
    },

  },

  methods: {

    onSubmit() {
      this.zuiw.close();
    },

  },

};
</script>

<style lang="sass">
.entity-zui-playlist-transmit
  display: grid
  grid-template-rows: 40px 1fr

  &__actions
    display: flex

  &__submit
    flex-grow: 1

</style>