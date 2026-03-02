const ActionBase = require('../../action/src/ActionBase');

module.exports = class EldtrichAction extends ActionBase {

  /**
   * @param {import('../Collector/Action.collector')} collector 
   */
  static define(collector) {
    collector.add('eldritch');
  }

  async getActionOptions(items, { option }) {
    if (option.key === 'game') {
      items.push({
        name: 'Eldritch',
        description: 'Game - Eldritch',
        value: 'eldritch',
      });
    }
  }

}