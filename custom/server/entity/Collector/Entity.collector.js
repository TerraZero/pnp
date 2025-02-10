const SystemCollector = require('zero-system/src/SystemCollector');

module.exports = class EntityCollector extends SystemCollector {

  /**
   * @param {SystemCollector} collector 
   */
  static define(collector) {
    collector.add('entity');
  }

  /**
   * @param {string} path 
   */
  constructor(path = 'Entity') {
    super('entity', path, '**/*.entity.js');
  }

  /**
   * @template T
   * @param {SystemItem} item 
   * @param {new (...args) => T} Construct
   * @returns {T}
   */
  factory(item, Construct) {
    if (this._storage === undefined) {
      this._storage = SystemCollector.get('service.storage');
    }
    return new Construct(this._storage);
  }

}