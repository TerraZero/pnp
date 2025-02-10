const SystemCollector = require('zero-system/src/SystemCollector');

module.exports = class ActionCollector extends SystemCollector {

  /**
   * @param {SystemCollector} collector 
   */
  static define(collector) {
    collector.add('action');
  }

  /**
   * @param {string} path 
   */
  constructor(path = 'Action') {
    super('action', path, '**/*.action.js');
  }

}