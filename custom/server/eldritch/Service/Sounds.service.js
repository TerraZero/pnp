const { SystemCollector } = require('zero-system/src/SystemItem');

module.exports = class SoundsService {

  /**
   * @param {import('zero-system/src/Collector/Service.collector')} collector 
   */
  static define(collector) {
    collector.add('sounds').setTag('rmi');
  }

  constructor() {
    /** @type {import('zero-system/src/Nuxt/Socket/Server')} */
    this.server = SystemCollector.get('socket');
  }

  /**
   * @returns {import('zero-system/src/Nuxt/Socket/Mount')}
   */
  getScreenClient() {
    return this.server.clients.find(v => v.info.ident === 'screen');
  }

  /**
   * @param {(import('../Remote/Sounds.remote').T_SoundItem|string)} sound 
   */
  play(sound) {
    if (typeof sound === 'string') {
      sound = {
        id: sound,
      };
    }
    this.getScreenClient().socket.emit('eldritch.sounds.screen', {
      action: 'sound',
      sound,
    });
  }

  /**
   * @param {(import('../Remote/Sounds.remote').T_SoundItem[]|string[])} sounds 
   */
  playlist(sounds) {
    for (const index in sounds) {
      if (typeof sounds[index] === 'string') {
        sounds[index] = {
          id: sounds[index],
        };
      }
    }
    this.getScreenClient().socket.emit('eldritch.sounds.screen', {
      action: 'playlist',
      sounds,
    });
  }

  /**
   * @param {number} volume - [0 - 100]
   */
  volume(volume) {
    this.getScreenClient().socket.emit('eldritch.sounds.screen', {
      action: 'volume',
      volume,
    });
  }

}