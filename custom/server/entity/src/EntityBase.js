module.exports = class EntityBase {

  /**
   * @param {import('../Service/Storage.service')} storage 
   */
  constructor(storage) {
    this.storage = storage;
    this.table = null;
    this.uuids = ['id'];
    this.data = null;
    this.isNew = true;

    this.init();
  }

  /**
   * @param {Object} params 
   * @returns {this}
   */
  async load(params) {
    this.data = await this.storage.load(this, params);
    if (this.data !== null) {
      this.isNew = false;
    }
    return this;
  }

  init() { }

}