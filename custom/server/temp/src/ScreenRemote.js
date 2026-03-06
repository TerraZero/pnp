const RemoteSystem = require('zero-system/src/RemoteSystem');

module.exports = class ScreenRemote {

  constructor() {
    this._handler = null;
    RemoteSystem.instance.socket.mount.addHandler('command.screen', async (...args) => {
      return await this._handler?.(...args);
    });
  }

  async register() {
    return (await RemoteSystem.instance.socket.mount.request('temp.register.screen')).data;
  }

  async command(data, meta = {}) {
    return await RemoteSystem.instance.socket.mount.request('temp.command.screen', data, meta);
  }

  /**
   * @param {import('zero-system/src/Nuxt/Socket/Server').C_Handler} handler 
   */
  init(handler) {
    this._handler = handler;
  }

  /**
   * @param {number} slideshow 
   */
  async setSlides(slideshow) {
    return await this.command({ func: 'setSlides', params: { slideshow } });
  }

  /**
   * @param {(number|null)} image
   */
  async setSlideLock(image) {
    return await this.command({ func: 'setSlideLock', params: { image } });
  }

  /**
   * @param {number} playlist 
   */
  async setPlaylist(playlist) {
    return await this.command({ func: 'setPlaylist', params: { playlist } });
  }

  /**
   * @param {number} volume 
   */
  async setMasterVolume(volume) {
    return await this.command({ func: 'setMasterVolume', params: { volume } });
  }

  /**
   * @param {number} speed 
   */
  async setSlideshowSpeed(speed) {
    return await this.command({ func: 'setSlideshowSpeed', params: { speed } });
  }

  /**
   * @param {number} sound 
   */
  async setSound(sound) {
    return await this.command({ func: 'setSound', params: { sound } });
  }

  /**
   * @param {string} headline
   * @param {string} subline
   */
  async setText(headline, subline) {
    return await this.command({ func: 'setText', params: { headline, subline } });
  }

  async stop() {
    return await this.command({ func: 'stop', params: { } });
  }

}