const RemoteSystem = require('zero-system/src/RemoteSystem');

module.exports = class ControlRemote {

  constructor() {
    this._handler = null;
    RemoteSystem.instance.socket.mount.addHandler('command.control', async (...args) => {
      return await this._handler?.(...args);
    });
  }

  async register() {
    return (await RemoteSystem.instance.socket.mount.request('temp.register.control')).data;
  }

  async command(data, meta = {}) {
    return await RemoteSystem.instance.socket.mount.request('temp.command.control', data, meta);
  }

  /**
   * @param {import('zero-system/src/Nuxt/Socket/Server').C_Handler} handler 
   */
  init(handler) {
    this._handler = handler;
  }

  async setSlide(slideshow, index, lock = null) {
    return await this.command({ func: 'setSlide', params: { slideshow, index, lock }});
  }

  async setStatus(slideshow) {
    return await this.command({ func: 'setStatus', params: { slideshow }});
  }

}