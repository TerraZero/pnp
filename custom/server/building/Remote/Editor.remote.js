const RemoteSystem = require('zero-system/src/RemoteSystem');
const FormBase = require('../../form/src/FormBase');

module.exports = class EditorRemote {

  static EVENT__EDITOR_TILE_TYPES = 'editor:tile:registry';

  /**
   * @param {import('zero-system/src/Collector/Remote.collector')} collector 
   */
  static define(collector) {
    collector.add('editor');
  }

  constructor() {
    this._types = null;
  }

  async getTileTypes() {
    if (this._types === null) {
      this._types = [];
      for (const item in RemoteSystem.instance.namespace) {
        if (item.startsWith('editortile.')) {
          this._types.push(await RemoteSystem.get(item));
        }
      }
    }
    return this._types;
  }

  async getTileType(key) {
    const types = await this.getTileTypes();
    return types.find(v => v.info.key === key);
  }

}