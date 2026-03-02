const ContentEntityBase = require('../../entity/src/ContentEntityBase');

/**
 * @extends ContentEntityBase<import('prisma/prisma-client').Map, import('prisma/prisma-client').Prisma.MapDelegate>
 */
module.exports = class MapEntity extends ContentEntityBase {

  /**
   * @param {import('../../entity/Collector/Entity.collector')} collector 
   */
  static define(collector) {
    collector.addContentEntity('map');
  }

  /** 
   * @returns {T_ContentEntityInfo} 
   */
  info() {
    return {
      type: 'map',
      label: 'Map',
      routes: {
        edit: {
          url: '/{game}/map/{id}/edit',
          icon: 'edit',
          label: 'Edit',
        },
        map: {
          url: '/{game}/map/{id}/map',
          icon: 'map-location',
          label: 'Map',
        },
      },
    };
  }

}