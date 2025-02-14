module.exports = class EntityBase {

  static TAG_ENTITY_ACTIONS = 'entity.actions';

  /**
   * @param {import('zero-system/src/SystemItem')} item
   * @param {import('../Service/Storage.service')} storage 
   */
  constructor(item, storage) {
    this._item = item;
    this._storage = storage;

    this.init();
  }

  /** @returns {import('../Service/Storage.service')} */
  get storage() {
    return this._storage;
  }

  init() { }

}