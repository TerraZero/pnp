const ContentEntityBase = require('../../entity/src/ContentEntityBase');

/**
 * @extends ContentEntityBase<import('prisma/prisma-client').Unit, import('prisma/prisma-client').Prisma.UnitDelegate>
 */
module.exports = class UnitEntity extends ContentEntityBase {

  /**
   * @param {import('../../entity/Collector/Entity.collector')} collector 
   */
  static define(collector) {
    collector.addContentEntity('unit');
  }

  /** 
   * @returns {T_ContentEntityInfo} 
   */
  info() {
    return {
      type: 'unit',
      label: 'Unit',
      table: 'unit',
      routes: {
        edit: {
          url: '/{game}/unit/{id}/edit',
          icon: 'edit',
          label: 'Edit',
        },
      },
      windows: {
        attributes: {
          edit: 'Edit attributes',
          required: ['type', 'label'],
          build: {
            component: 'Entity/ZUI/Unit/Attributes',
            params: {
              entity: null,
            },
            frame: {
              title: 'Edit attributes "{params.entity.label}"',
            },
          },
        },
      },
    };
  }

}