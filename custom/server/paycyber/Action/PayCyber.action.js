const ActionBase = require('../../action/src/ActionBase');

module.exports = class PayCyberAction extends ActionBase {

  /**
   * @param {import('../Collector/Action.collector')} collector 
   */
  static define(collector) {
    collector.add('paycyber');
  }

  async getActionOptions(items, { option }) {
    if (option.key === 'game') {
      items.push({
        name: 'PayCyber',
        description: 'Game - PayCyber',
        value: 'paycyber',
      });
    }
  }

}