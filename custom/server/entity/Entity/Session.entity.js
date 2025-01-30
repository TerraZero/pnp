module.exports = class SessionEntity {

  /**
   * @param {import('../Collector/Entity.collector')} collector 
   */
  static define(collector) {
    collector.add('session');
  }

  constructor(storage) {
    this.storage = storage;
  }

}