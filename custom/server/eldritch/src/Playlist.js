/**
 * @typedef {Object} T_PlaylistSettings
 * @property {boolean} random
 * @property {boolean} loop
 */

const Events = require('events');
// const RandomUtil = require('~/custom/util/RandomUtil');

module.exports = class Playlist {

  /**
   * @param {import('../Remote/Sounds.remote')} remote
   * @param {import('../Remote/Sounds.remote').T_SoundItem[]} sounds 
   */
  constructor(remote, sounds) {
    this.events = new Events();
    this.remote = remote;
    this.sounds = sounds;
    this.index = null;
    this.history = [];
    this.settings = {
      random: false,
      loop: false,
    };
  }

  /** @returns {?import('../Remote/Sounds.remote').T_SoundItem} */
  get current() {
    return this.sounds[this.index] ?? null;
  }

  /**
   * @param {?string} id 
   * @returns {?import('../Remote/Sounds.remote').T_SoundObject}
   */
  get(id = null) {
    return this.remote.get(id ?? this.current);
  }
  
  /**
   * @param {T_PlaylistSettings} settings 
   * @returns {this}
   */
  setSettings(settings) {
    for (const setting in settings) {
      this.setSetting(setting, settings[setting], false);
    }
    this.events.emit('settings', { playlist: this, settings });
    return this;
  }

  /**
   * @param {string} setting 
   * @param {any} value 
   * @param {boolean} populate
   * @returns {this}
   */
  setSetting(setting, value, populate = true) {
    this.settings[setting] = value;
    if (populate) this.events.emit('setting', { playlist: this, setting, value });
    return this;
  }

  isPlaying() {
    return this.index !== null;
  }

  play() {
    if (!this.isPlaying()) {
      this.next();
      this.events.emit('play', { playlist: this });
    }
    return this;
  }

  stop() {
    if (this.isPlaying()) {
      const sound = this.remote.get(this.current);
      sound.howl.off('end');
      this.remote.stop(this.current.id);
      this.index = null;
      this.events.emit('stop', { playlist: this });
    }
    return this;
  }

  async next() {
    let nextIndex = (this.index === null ? 0 : ++this.index);
    if (this.settings.loop) {
      nextIndex = nextIndex % this.sounds.length;
    } else if (nextIndex === this.sounds.length) {
      this.stop();
      return;
    }
    if (this.sounds.length === this.history.length) this.history = [];
    if (this.settings.random) {
      const random = RandomUtil.getRandomInt(0, this.sounds.length - this.history.length);
      nextIndex = 0;
      for (let i = 0; i < this.sounds.length; i++) {
        if (this.history.includes(i)) continue;
        nextIndex++;
        if (nextIndex >= random) {
          nextIndex = i;
          break;
        }
      }
    }
    this.remote.stop(this.current?.id);
    this.index = nextIndex;
    this.history.push(this.index);
    const item = await this.remote.play(this.current);
    item.instance.howl.once('end', this.next.bind(this));
    this.events.emit('next', { playlist: this, item });
    return this;
  }

}