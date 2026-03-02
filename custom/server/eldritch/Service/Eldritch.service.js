const { SystemCollector } = require('zero-system/src/SystemItem');

module.exports = class EldritchService {

  /**
   * @param {import('zero-system/src/Collector/Service.collector')} collector 
   */
  static define(collector) {
    collector.add('eldritch').setTag('rmi');
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

  setCurrent(current) {
    this.getScreenClient()?.socket.emit('eldritch.screen', {
      action: 'current',
      current,
    });
  }

}