module.exports = class RMIRemote {

  /**
   * @param {import('zero-system/src/Collector/RemoteCollector')} collector 
   */
  static define(collector) {
    collector.add('rmi');
  }

}