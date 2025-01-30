module.exports = class StorageService {

  /**
   * @param {import('zero-system/src/Collector/ServiceCollector')} collector 
   */
  static define(collector) {
    collector.add('storage');
  }

}