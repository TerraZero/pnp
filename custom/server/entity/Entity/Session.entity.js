module.exports = class SessionEntity {

  /**
   * @param {import('../Collector/EntityCollector')} collector 
   */
  static define(collector) {
    collector
      .add('session')
      .setVolatile();
  }

  constructor(storage) {
    this.storage = storage;
  }

}