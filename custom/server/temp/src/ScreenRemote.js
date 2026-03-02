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
   * @param {number} id 
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

}