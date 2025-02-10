const SystemCollector = require('zero-system/src/SystemCollector');

module.exports = class ActionService {

  /**
   * @param {import('zero-system/src/Collector/Service.collector')} collector 
   */
  static define(collector) {
    collector.add('action').setTag('rmi');
  }

  constructor() {
    this.actions = null;
  }

  /**
   * @param {string} search 
   * @returns 
   */
  async getActions(search) {
    if (this.actions === null) {
      this.actions = [];

      for (const item of SystemCollector.finds(v => v.hasTag('action'))) {
        this.actions.push(...await SystemCollector.get(item.name).getActions());
      }
    }

    console.log(this.actions);
    return this.actions.filter(action => {
      return action.name.includes(search) || action.description?.includes(search) || action.tags?.reduce((p, t) => p || t.includes(search), false);
    }).slice(0, 5);
  }

}