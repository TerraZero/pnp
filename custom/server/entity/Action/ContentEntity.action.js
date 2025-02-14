const SystemCollector = require('zero-system/src/SystemCollector');

const ActionBase = require('../../action/src/ActionBase');
const { TAG_ENTITY_ACTIONS } = require('../src/EntityBase');

module.exports = class ContentEntityAction extends ActionBase {

  /**
   * @param {import('../../action/Collector/Action.collector')} collector 
   */
  static define(collector) {
    collector.add('content.entity');
  }

  async getEntityActions(items, query) {
    for (const item of SystemCollector.finds(v => v.hasTag(TAG_ENTITY_ACTIONS))) {
      /** @type {import('../src/ContentEntityBase')} */
      const entity = SystemCollector.get(item.name);

      if (query.type && query.type.length > 0 && !entity.info().type.includes(query.type)) continue;
      await entity.getEntityActions(items, query);
    }
  }

}