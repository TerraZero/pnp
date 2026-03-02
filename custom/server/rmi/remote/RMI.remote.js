/**
 * @typedef {Object} T_RemoteInfo
 * @property {string} name
 * @property {string[]} tags
 * @property {Object<string, any>} attributes
 */

const RemoteSystem = require('zero-system/src/RemoteSystem');

module.exports = class RMIRemote {

  /**
   * @param {import('zero-system/src/Collector/RemoteCollector')} collector 
   */
  static define(collector) {
    collector.add('rmi');
  }

  /**
   * @returns {T_RemoteInfo[]}
   */
  static async getInfo() {
    if (this._info === undefined) {
      const request = await RemoteSystem.instance.socket.mount.request('rmi.info');

      this._info = request.data.info;
    }
    return this._info;
  }

  /**
   * @param {import('zero-system/src/RemoteSystem')} system 
   */
  static async setupInit(system) {
    system.addResolver(this.resolver.bind(this), 2000);
  }

  /**
   * @param {Object} param0 
   * @returns {?Object}
   */
  static async resolver(id) {
    const rmis = await this.getInfo();
    const data = rmis.find(v => v.name === id) ?? null;
    if (data === null) return null;
    const proxy = this.createProxy(data, data.attributes['rmi.timeout'] ?? 1000);
    RemoteSystem.instance.set(id, proxy);
    return proxy;
  }

  /**
   * @param {T_RemoteInfo} info
   * @param {number} timeout
   */
  static createProxy(info, timeout) {
    return new Proxy({}, {

      get(target, method, receiver) {
        if (method === 'then') return null;
        return async (...args) => {
          const result = await RemoteSystem.instance.socket.mount.request('rmi.method', {
            info,
            method,
            args,
          }, { timeout });
          if (result.meta.error) {
            throw new Error(result.meta.error);
          }
          return result.data.result;
        };
      }

    });
  }

}