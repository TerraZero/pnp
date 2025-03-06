const SystemCollector = require('zero-system/src/SystemCollector');

module.exports = class EditorTileCollector extends SystemCollector {

  /**
   * @param {SystemCollector} collector 
   */
  static define(collector) {
    collector.add('editortile');
  }

  /**
   * @param {string} path 
   */
  constructor(path = 'EditorTile') {
    super('editortile', path, '**/*.tile.js');
  }

}