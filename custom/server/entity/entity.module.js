const ZeroModule = require('zero-system/src/ZeroModule');
const SystemCollector = require('zero-system/src/SystemCollector');

module.exports = class EntityModule extends ZeroModule {

  /**
   * @param {import('zero-system/src/Collector/ModuleCollector')} collector 
   */
  static define(collector) {
    collector.add('entity');
  }

  async setupInit() {
    /** @type {import('./Service/Storage.service')} */
    const storage = SystemCollector.get('service.storage');

    await storage.load('session', { user: '12345', key: 'sdfsdf' })
  }

}