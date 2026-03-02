const SystemCollector = require('zero-system/src/SystemCollector');

const ActionBase = require('../../action/src/ActionBase');
const ContentEntityBase = require('../src/ContentEntityBase');

module.exports = class ContentEntityAction extends ActionBase {

  /**
   * @param {import('../../action/Collector/Action.collector')} collector 
   */
  static define(collector) {
    collector.add('content.entity');
  }

  async getEntityActions(items, query) {
    for (const item of SystemCollector.finds(v => v.hasTag(ContentEntityBase.TAG_ENTITY_ACTIONS))) {
      /** @type {import('../src/ContentEntityBase')} */
      const entity = SystemCollector.get(item.name);

      if (query.type && query.type.length > 0 && !entity.info().type.includes(query.type)) continue;
      await entity.getEntityActions(items, query);
    }
  }

  async getActionOptions(items, { option, search }) {
    if (option.key === 'entity_type') {
      for (const item of SystemCollector.finds(v => v.hasTag(ContentEntityBase.TAG_ENTITY_CONTENT))) {
        /** @type {import('../src/ContentEntityBase')} */
        const entity = SystemCollector.get(item.name);

        items.push({
          name: entity.info().label,
          description: entity.info().description ?? 'Type: ' + entity.info().label,
          value: entity.info().type,
        });
      }
    } else if (option.key === 'id' && option.placeholders?.entity_type) {
      /** @type {import('../src/ContentEntityBase')} */
      const entity = SystemCollector.get('entity.' + option.placeholders.entity_type);

      for (const item of await entity.list(search, 5)) {
        const params = entity.getParamsReverse(item);
        items.push({
          name: item[entity.key('label') ?? 'name'],
          description: 'ID: ' + params.id,
          value: params.id,
        });
      }
    }
  }

}