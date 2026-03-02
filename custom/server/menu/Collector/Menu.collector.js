const SystemCollector = require('zero-system/src/SystemCollector');

module.exports = class MenuCollector extends SystemCollector {

  /**
   * @param {SystemCollector} collector 
   */
  static define(collector) {
    collector.add('menu');
  }

  /**
   * @param {string} path 
   */
  constructor(path = 'Menu') {
    super('menu', path, '**/*.menu.js');
  }

}