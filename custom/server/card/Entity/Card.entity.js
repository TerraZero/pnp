const ContentEntityBase = require('../../entity/src/ContentEntityBase');

/**
 * @extends ContentEntityBase<import('prisma/prisma-client').Card, import('prisma/prisma-client').Prisma.CardDelegate>
 */
module.exports = class CardEntity extends ContentEntityBase {

  /**
   * @param {import('../../entity/Collector/Entity.collector')} collector 
   */
  static define(collector) {
    collector.addContentEntity('card');
  }

  /** 
   * @returns {T_ContentEntityInfo} 
   */
  info() {
    return {
      type: 'card',
      label: 'Card',
      routes: {
        edit: {
          url: '/system/card/{id}/edit',
          icon: 'edit',
          label: 'Edit',
        },
        editor: {
          url: '/card/{id}/editor',
          icon: 'edit',
          label: 'Editor',
        },
      },
    };
  }

}