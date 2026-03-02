/**
 * @typedef {Object} T_SoundObject
 * @property {Howl} howl
 * @property {boolean} loaded
 * @property {number} volume
 */

/**
 * @typedef {Object} T_SoundItem
 * @property {string} id
 * @property {number} volume - [0 - 1]
 */

const { Howl, Howler } = require('howler');
const Events = require('events');
const Path = require('path');
const Sounds = require('../../../namespaces/sounds.namespace');
const AsyncPromise = require('zero-util/src/AsyncPromise');
const RemoteSystem = require('zero-system/src/RemoteSystem');
const Playlist = require('../src/Playlist');

/** @type {import('../Remote/Sounds.remote')} */
let _SoundRemote = null;

module.exports = class SoundsRemote {

  /**
   * @param {import('zero-system/src/Collector/RemoteCollector')} collector 
   */
  static define(collector) {
    collector.add('sounds');
  }

  static setupInit() {
    _SoundRemote ??= RemoteSystem.getSync('remote.sounds');
    RemoteSystem.instance.socket.mount.socket.on('eldritch.sounds.screen', ({ action, sound }) => {
      console.log(action, sound);
      switch (action) {
        case 'sound':
          _SoundRemote.play(sound);
          break;
        case 'playlist':
          break;
      }
    });
  }

  constructor() {
    this.sounds = null;
    this.events = new Events();
    this.loaded = false;
    this.playlist = null;
  }

  /**
   * @param {string} id
   * @returns {?T_SoundObject}
   */
  get(id) {
    return this.sounds[id] ?? null;
  }

  /**
   * @param {number} volume - [0 - 1]
   * @returns {this}
   */
  setMasterVolume(volume) {
    Howler.volume(volume);
    return this;
  }

  /**
   * @param {({ id: string, instance: T_SoundObject }) => void} callback 
   */
  load(callback = null) {
    if (this.sounds === null) {
      this.sounds = {};
      for (const sound in Sounds) {
        const id = sound.substring(0, sound.length - Path.extname(sound).length);
        const item = {
          id,
          howl: new Howl({
            src: Path.join('/eldritch/music', sound),
            preload: true,
          }),
          loaded: false,
          volume: 1,
        };
        this.sounds[id] = item;
        if (typeof callback === 'function') callback({ service: this, instance: item, id });
        
        item.howl.on('load', () => {
          item.loaded = true;
          this.events.emit('loaded', { id, instance: item });
          for (const id in this.sounds) {
            if (!this.sounds[id].loaded) return;
          }
          this.loaded = true;
        });
        item.howl.on('play', () => {
          item.howl.volume(item.volume);
        });
      }
    }
  }

  /**
   * @param {T_SoundItem} sound
   * @returns {{ sound: T_SoundItem, instance: T_SoundObject, sream: number }}
   */
  async play(sound) {
    const promise = new AsyncPromise();
    if (this.loaded || this.sounds && this.sounds[sound.id] && this.sounds[sound.id].loaded) {
      if (sound.volume) this.sounds[sound.id].howl.volume(sound.volume);
      promise.resolve({
        sound,
        instance: this.sounds[sound.id],
        stream: this.sounds[sound.id].howl.play(),
      });
    } else {
      this.events.on('loaded', ({ id: soundId, instance }) => {
        if (sound.id === soundId) {
          if (sound.volume) instance.howl.volume(sound.volume);
          promise.resolve({
            sound,
            instance,
            stream: instance.howl.play(),
          });
        }
      });
    }
    return promise.promise;
  }

  /**
   * @param {?string} id 
   */
  async stop(id = null) {
    if (id !== null) {
      this.sounds[id].howl.stop();
    }
  }

  /**
   * @param {T_SoundItem[]} sounds 
   * @returns {Playlist}
   */
  setPlaylist(sounds) {
    if (this.playlist !== null) this.playlist.stop();
    this.playlist = new Playlist(this, sounds);
    return this.playlist;
  }

}