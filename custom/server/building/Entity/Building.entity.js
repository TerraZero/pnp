const ContentEntityBase = require('../../entity/src/ContentEntityBase');

/**
 * @extends ContentEntityBase<import('prisma/prisma-client').Building, import('prisma/prisma-client').Prisma.BuildingDelegate>
 */
module.exports = class BuildingEntity extends ContentEntityBase {

  /**
   * @param {import('../../entity/Collector/Entity.collector')} collector 
   */
  static define(collector) {
    collector.addContentEntity('building');
  }

  /** 
   * @returns {T_ContentEntityInfo} 
   */
  info() {
    return {
      type: 'building',
      label: 'Building',
      routes: {
        edit: {
          url: '/{game}/building/{id}/edit',
          label: 'Edit',
          icon: 'edit',
        },
        editor: {
          url: '/{game}/building/{id}/editor',
          label: 'Editor',
          icon: 'map-location',
        },
      },
      keys: {
        config: 'value.config',
      },
    };
  }

}