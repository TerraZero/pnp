/**
 * @typedef {import('zero-system/src/Nuxt/Socket/Server').T_Request} T_SessionRequest
 * @property {string} session
 */

const ZeroModule = require('zero-system/src/ZeroModule');
const SystemCollector = require('zero-system/src/SystemCollector');

module.exports = class EntityModule extends ZeroModule {

  /**
   * @param {import('zero-system/src/Collector/ModuleCollector')} collector 
   */
  static define(collector) {
    collector.add('entity');
  }

  /**
   * @param {import('zero-system/src/Nuxt/Socket/Server')} server 
   */
  async setupModuleSocket(server) {
    server.setSessionHandler(this.sessionHandler.bind(this));
  }

  /**
   * @param {import('zero-system/src/Nuxt/Socket/Mount').T_RequestEvent} event 
   * @param {string} key 
   * @param {any} value 
   * @returns {Promise<any>}
   */
  async sessionHandler(event, key, value) {
    // TODO expired session should create a new session
    event.request.server.sessionData ??= {};
    if (value === undefined) {
      if (event.request.server.sessionData[key] === undefined) {
        const session = SystemCollector.get('entity.session');
        event.request.server.sessionData[key] = await session.get(event.request.meta.session, key, event.request.server.timestamp);
      }
    } else {
      event.request.server.sessionData[key] = value;
      const session = SystemCollector.get('entity.session');
      await session.set(event.request.meta.session, key, value, event.request.server.timestamp);
    }
    return event.request.server.sessionData[key];
  }

}