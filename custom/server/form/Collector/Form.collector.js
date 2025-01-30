const SystemCollector = require('zero-system/src/SystemCollector');

module.exports = class FormCollector extends SystemCollector {

  /**
   * @param {SystemCollector} collector 
   */
  static define(collector) {
    collector.add('form');
  }

  /**
   * @param {string} path 
   */
  constructor(path = 'Form') {
    super('form', path, '**/*.form.js');
  }

}