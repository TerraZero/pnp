const SystemCollector = require('zero-system/src/SystemCollector');
const ContentEntityBase = require('../src/ContentEntityBase');

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
    return new Construct(item, this._storage);
  }

  /**
   * @param {string} name 
   * @param {number} timeout 
   * @returns {SystemItem}
   */
  addContentEntity(name, timeout = 10000) {
    return this.add(name)
      .setTag('rmi')
      .setTag(ContentEntityBase.TAG_ENTITY_CONTENT)
      .setTag(ContentEntityBase.TAG_ENTITY_ACTIONS)
      .setAttribute('rmi.timeout', timeout)
      .setAttribute('entity_type', name);
  }

}