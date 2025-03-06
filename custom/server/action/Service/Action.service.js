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
    if (search.startsWith(':')) {
      const actions = [];
      const parts = search.split(' ');
      const first = parts.shift().substring(1);
      const query = {
        search,
        selector: ':',
        type: first,
        filter: parts.join(' '),
      };
      for (const item of SystemCollector.finds(v => v.hasTag('action'))) {
        await SystemCollector.get(item.name).getEntityActions(actions, query);
      }
      return actions;
    } 
    
    if (this.actions === null) {
      this.actions = [];
  
      for (const item of SystemCollector.finds(v => v.hasTag('action'))) {
        await SystemCollector.get(item.name).getActions(this.actions)
      }
    }

    return this.actions.filter(action => {
      return action.name.includes(search) || action.description?.includes(search) || action.tags?.reduce((p, t) => p || t.includes(search), false);
    }).slice(0, 5);
  }

  /**
   * @param {any} option 
   * @param {string} search 
   */
  async getActionOptions(option, search) {
    const options = [];
    for (const item of SystemCollector.finds(v => v.hasTag('action'))) {
      await SystemCollector.get(item.name).getActionOptions(options, { option, search });
    }
    return options.filter(v => {
      return (v.name + '').toLowerCase().includes(search) || (v.value + '').includes(search) || v.description?.toLowerCase().includes(search);
    }).slice(0, 5);
  }

}