const ContentEntityBase = require('../../entity/src/ContentEntityBase');

/**
 * @extends ContentEntityBase<import('prisma/prisma-client').Building, import('prisma/prisma-client').Prisma.BuildingDelegate>
 */
module.exports = class BuildingEntity extends ContentEntityBase {

  /**
   * @param {import('../../entity/Collector/Entity.collector')} collector 
   */
  static define(collector) {
    collector.add('building').setTag('rmi').setTag(this.TAG_ENTITY_ACTIONS);
  }

  /** 
   * @returns {T_ContentEntityInfo} 
   */
  info() {
    return {
      type: 'building',
      label: 'Building',
      routes: {
        edit: '/{game}/building/{id}/edit',
      },
    };
  }

}