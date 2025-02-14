const ZeroModule = require('zero-system/src/ZeroModule');

module.exports = class BuildingModule extends ZeroModule {

  /**
   * @param {import('zero-system/src/Collector/ModuleCollector')} collector 
   */
  static define(collector) {
    collector.add('building');
  }

}