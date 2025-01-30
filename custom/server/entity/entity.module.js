const ZeroModule = require('zero-system/src/ZeroModule');
const SystemCollector = require('zero-system/src/SystemCollector');

module.exports = class EntityModule extends ZeroModule {

  /**
   * @param {import('zero-system/src/Collector/ModuleCollector')} collector 
   */
  static define(collector) {
    collector.add('entity');
  }

  setupInit() {
    const entity = SystemCollector.get('entity.session');
    console.log(entity);
  }

}