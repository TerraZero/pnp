const SystemCollector = require('zero-system/src/SystemCollector');

module.exports = class WindowCollector extends SystemCollector {

  /**
   * @param {SystemCollector} collector 
   */
  static define(collector) {
    collector.add('window');
  }

  /**
   * @param {string} path 
   */
  constructor(path = 'Window') {
    super('window', path, '**/*.window.js');
  }

}