module.exports = class EntityBase {

  /**
   * @param {import('../Service/Storage.service')} storage 
   */
  constructor(storage) {
    this._storage = storage;

    this.init();
  }

  /** @returns {import('../Service/Storage.service')} */
  get storage() {
    return this._storage;
  }

  init() { }

}