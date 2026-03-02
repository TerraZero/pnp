const ContentEntityBase = require('../../entity/src/ContentEntityBase');

/**
 * @extends ContentEntityBase<import('prisma/prisma-client').UnitType, import('prisma/prisma-client').Prisma.UnitTypeDelegate>
 */
module.exports = class UnitTypeEntity extends ContentEntityBase {

  /**
   * @param {import('../../entity/Collector/Entity.collector')} collector 
   */
  static define(collector) {
    collector.addContentEntity('unit_type');
  }

  /** 
   * @returns {T_ContentEntityInfo} 
   */
  info() {
    return {
      type: 'unit_type',
      label: 'Unit Type',
      table: 'unitType',
      routes: {
        edit: {
          url: '/{game}/unit_type/{id}/edit',
          icon: 'edit',
          label: 'Edit',
        },
      },
      windows: {
        edit: {
          build: {
            component: 'Entity/ZUI/Form',
            params: {
              entity_type: 'unit_type',
            },
            frame: {
              title: 'Edit entity type "{params.entity.label}"',
            },
          },
        },
        displays: {
          edit: 'Edit displays',
          required: ['label'],
          build: {
            component: 'Entity/ZUI/UnitType/Displays',
            params: {
              entity: null,
            },
            frame: {
              title: 'Edit displays "{params.entity.label}"',
            },
          },
        },
        attributes: {
          edit: 'Edit attributes',
          required: ['label'],
          build: {
            component: 'Entity/ZUI/UnitType/Attributes',
            params: {
              entity: null,
            },
            frame: {
              title: 'Edit attributes "{params.entity.label}"',
            },
          },
        },
        actions: {
          edit: 'Edit actions',
          required: ['label'],
          build: {
            component: 'Entity/ZUI/UnitType/Actions',
            params: {
              entity: null,
            },
            frame: {
              title: 'Edit actions "{params.entity.label}"',
            },
          },
        },
        action: {
          build: {
            component: 'Entity/ZUI/UnitType/Action',
            params: {
              entity: null,
              index: 0,
            },
            frame: {
              title: 'Edit actions "{params.entity.label}"',
            },
          },
        },
      },
    };
  }

}