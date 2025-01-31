const EntityBase = require('../src/EntityBase');

module.exports = class SessionEntity extends EntityBase {

  /**
   * @param {import('../Collector/Entity.collector')} collector 
   */
  static define(collector) {
    collector.add('session');
  }

  init() {
    this.table = 'session';
    this.uuids = ['user', 'key'];
  }

}